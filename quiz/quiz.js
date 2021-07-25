
import quiz from './quiz.json';


class Quiz{

  constructor(quiz){
    this.quiz = quiz
    this.total = {}
  }

  checkIfQuizReady(){

    this.quiz.forEach(q => {
      if(!q.isStarted && q.dateStart > new Date().getTime()){
        this.launchQuizDiscord(q);
      }

      if(q.isStarted && !q.isComplete && q.dateStart > new Date().getTime()){
        this.endQuiz(q);
      }
      
    });

  }


  launchQuizDiscord(quiz, videoPath){
    quiz.isStarted = true;

    // send quiz video to discord
    const embed = new Discord.RichEmbed()
      .setTitle(quiz.title)
      .setDescription(quiz.description)
      .setColor(0x00ff00)
      .setImage(quiz.image)
      .setFooter(`${quiz.dateStart}`)
      .setTimestamp(quiz.dateStart)
  

    // send video to discord
    if(videoPath){
      embed.setVideo(videoPath)
    }


  

  }

  endQuiz(q){
    q.isComplete = true;
    
    for(const pseudo in Object.keys(q.answers)){
      const score = +(q.answers[pseudo] === q.rightChoice);
      if(!this.total[pseudo]){
        this.total[pseudo] = score;
      }else{
        this.total[pseudo] += score;
      }
    }
  }

}

export default new Quiz(quiz);