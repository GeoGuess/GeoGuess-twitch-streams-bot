const database = require('./database.js');

class GeoQuiz {
  constructor() {
    this.database = database;
  }

  async addAnswer(userId, answer) {
    return this.database.addAnswer(userId, answer);
  }
  async startQuestion(messageId) {
    await this.database.setQuizActive('quiz' + messageId);
    this.setMessageId(messageId);
  }

  setMessageId(messageId) {
    this.database.setMessageId(messageId);
  }

  setRightAnswer(rightAnswer) {
    this.database.setRightAnswer(rightAnswer);
  }

  async endQuestion() {
    const totalScore = await this.database.getTotals();
    const rightAnswer = await this.database.getRightAnswer();
    const answers = await this.database.getAnswers();
    const userIdWithRightAnswer = [];

    const answersCount = {};

    for (const userId in answers) {
      const answer = answers[userId];
      if (answersCount[answer] === undefined) {
        answersCount[answer] = 1;
      } else {
        answersCount[answer]++;
      }
      const score = +(rightAnswer === answer);
      if (score > 0) {
        userIdWithRightAnswer.push(userId);
      }
      if (!totalScore[userId]) {
        totalScore[userId] = score;
      } else {
        totalScore[userId] += score;
      }
    }

    Object.keys(answersCount).forEach((key, i) => {
      answersCount[key] =
        (answersCount[key] / Object.keys(answers).length) * 100;
    });

    this.database.setTotals(totalScore);
    this.database.setQuizActive('');
    return {
      congratUsers: userIdWithRightAnswer,
      percents: answersCount,
    };
  }

  async getAllScores() {
    const totalScore = await this.database.getTotals();
    const sortedScores = Object.keys(totalScore).sort(
      (a, b) => totalScore[b] - totalScore[a]
    );
    const scores = [];
    for (const userId of sortedScores) {
      scores.push({ userId, score: totalScore[userId] });
    }
    return scores;
  }
}

module.exports = GeoQuiz;
