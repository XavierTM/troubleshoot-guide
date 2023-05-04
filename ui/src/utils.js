import swal from "sweetalert";


function generateAnswerTree(answers) {

   // map
   const answerMap = new Map();

   answers.forEach(answer => {
      answerMap.set(answer.id, answer);
      answer.answers = [];
   });

   // build tree
   const topLevelAnswers = answers.filter(item => item.question === null);
   const nonTopLevelAnswers = answers.filter(item => item.question !== null);

   const answerTree = topLevelAnswers;

   nonTopLevelAnswers.forEach(answer => {
      const parent = answerMap.get(answer.question);

      if (parent) {
         parent.answers.push(answer);
      }
   });

   return answerTree;
}

function flattenAnswers(answeres) {

   if (!answeres || answeres.length === 0)
      return [];

   const flattenedAnswers = [];

   answeres.forEach(answer => {
      flattenedAnswers.push(answer);
      flattenedAnswers.push(...flattenAnswers(answer.answers));
      delete answer.answers;
   });

   return flattenedAnswers;
}

function delay(millis) {
   return new Promise((resolve) => {
      setTimeout(resolve, millis);
   })
}


function requestConfirmation({
   question,
   confirmButtonCaption='Yes',
   cancelButtonCaption="Cancel",
}) {
   return swal({
      text: question,
      buttons: [
         {
            text: confirmButtonCaption,
            value: true,
            className: "bg-red-600 text-white",
            visible: true,
         },
         {
            text: cancelButtonCaption,
            value: false,
            visible: true,
            className: "bg-white text-black"
         }
      ]
   });
}


export {
   delay,
   flattenAnswers,
   generateAnswerTree,
   requestConfirmation,
}