import { Button } from "@mui/material";
import Page from "./Page";
import { hideLoading, showLoading } from "../loading";
import swal from "sweetalert";
import { generateAnswerTree } from "../utils";
import request from "../request";
import ArrowIcon from '@mui/icons-material/ArrowRightAlt';
import BackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/VpnKey';


const DEFAULT_QUESTION = 'What do you want help with?'


export default class Guide extends Page {

   state = {
      answersFetched: false,
      current: null,
      answers: [],
   }

   goToHome = () => {
      return this.updateState({
         current: {
            answers: this.state.answers,
            sub_question: DEFAULT_QUESTION,
            previous: null,
         }
      });
   }

   back = () => {
      return this.updateState({
         current: this.state.current.previous
      });
   } 

   goToLogin = () => {
      window.App.redirect('/login');
   }

   fetchAnswers = async () => {

      try {
         showLoading();

         const res = await request.get('/api/answers');
         const answers = generateAnswerTree(res.data);

         this.updateState({
            answers,
            answersFetched: true,
            current: {
               answers,
               sub_question: DEFAULT_QUESTION,
               previous: null,
            },
         });
         
      } catch (err) {
         swal(String(err))
      } finally {
         hideLoading();
      }
   }


   componentDidMount() {
      super.componentDidMount()
      this.fetchAnswers();
   }

   _render() {


      if (!this.state.answersFetched) {
         return <div className="vh-align fill-container">
            <div className="max-w-[300px]">
               <p className="text-xl text-gray-600">Something went wrong!</p>
               <Button onClick={this.fetchAnswers}>
                  RETRY
               </Button>
            </div>
         </div>
      }

      let answersJSX, solutionJSX, title;
      const current = this.state.current;
      

      if (current.solution) {
         solutionJSX = <p className="">
            {current.solution}
         </p>

         title = "Solution";

      } else if (current.sub_question) {

         if (Array.isArray(current.answers) && current.answers.length > 0) {
            answersJSX = current.answers.map(answer => {
               return <div 
                  className="v-align" 
                  style={{ 
                     cursor: 'pointer' 
                  }} 
                  onClick={
                     () => {

                        const previous = this.state.current;
                        const current = { ...answer, previous };

                        this.updateState({ current });
                     }
                  }>
                  <ArrowIcon />

                  <p className="text-gray-600 text-lg">
                     {answer.caption}
                  </p>
               </div>
            });
         } else {
            answersJSX = <p className="text-gray-600 text-xl">
               No responses added on the system.
            </p>
         }

         title = current.sub_question;
         
      } else {

         answersJSX = <p className="text-gray-600 text-xl">
            No follow-up question or solution provided on the system.
         </p>
         
         title = "No information available";

      }

      const footerButtonsDisabled = current.previous === null;

      return <div 
         className="grid fill-container"
         style={{
            gridTemplateRows: 'auto 70px',
         }}
      >
         <div className="p-4" style={{ overflowY: 'auto' }}>

            <h1 className="text-gray-600 text-2xl">{title}</h1>

            {answersJSX}
            {solutionJSX}
         </div>

         <div
            style={{
               borderTop: '1px #ccc solid',
               justifyContent: 'right',
            }}
            className="v-align pr-3"
         >
            <Button onClick={this.back} startIcon={<BackIcon />} disabled={footerButtonsDisabled}>
               BACK
            </Button>

            <Button onClick={this.goToHome} startIcon={<HomeIcon />} disabled={footerButtonsDisabled}>
               HOME
            </Button>

            <Button onClick={this.goToLogin} startIcon={<LoginIcon />}>
               LOGIN
            </Button>
         </div>
      </div>
   }
}