import swal from "sweetalert";
import Page from "./Page";
import { hideLoading, showLoading } from '../loading';
import request from '../request'
import { flattenAnswers, generateAnswerTree } from "../utils";
import Button from '@mui/material/Button'
import Answer from '../components/Answer';
import AddIcon from '@mui/icons-material/Add';
import AnswerEditor from "../components/AnswerEditor";


export default class Dashboard extends Page {

   state = {
      answers: [],
      answersFetched: false,
      answerEditorMode: null,
      newAnswerQuestionId: null,
      answerBeingEdited: null,
   }

   updateState = (update={}) => {
      return new Promise(resolve => {
         this.setState({ ...this.state, ...update }, resolve);
      });
   }


   addAnswerToTree = (answer) => {
      const flattenedAnswers = flattenAnswers(this.state.answers);
      flattenedAnswers.push(answer);
      const answers = generateAnswerTree(flattenedAnswers);

      return this.updateState({ answers });
   }

   updateAnswerOnTree = async (id, update) => {
      let flattenedAnswers = flattenAnswers(this.state.answers);

      flattenedAnswers = flattenedAnswers.map(answer => {

         if (answer.id === id)
            answer = { ...answer, ...update }

         return answer;
      })
      
      const answers = generateAnswerTree(flattenedAnswers);
      return this.updateState({ answers });
   }

   removeAnswerFromTree = (id) => {
      // eslint-disable-next-line
      const [ _, answers ] = this.deleteAnswerById(this.state.answers, id);
      return this.updateState({ answers });
   }

   deleteAnswerByParentId = (id) => {
      
      let flattenedAnswers = flattenAnswers(this.state.answers);
      const toBeDeletedIds = flattenedAnswers
         .filter(item => item.question === id)
         .map(item => item.id);
      
      flattenedAnswers = flattenedAnswers.filter(item => {
         if (toBeDeletedIds.includes(item.id))
            return false;
         return true;
      });

      const answers = generateAnswerTree(flattenedAnswers);
      return this.updateState({ answers });
   }

   deleteAnswerById(answers, id) {

      const resultingAnswers = answers.filter(item => item.id !== id);
   
      if (resultingAnswers.length !== answers.length)
         return [ true, resultingAnswers ];
   
      let filtered = false;
   
      for (let i in resultingAnswers) {
         const answer = resultingAnswers[i];
         const [ done, resultingSubAnswers] = this.deleteAnswerById(answer.answers, id);
   
         if (done) {
            answer.answers = resultingSubAnswers;
            filtered = true;
            break;
         }
      }
   
      return [ filtered, resultingAnswers];
   }

   addAnswer = (newAnswerQuestionId) => {

      if (typeof newAnswerQuestionId !== 'number')
         newAnswerQuestionId = null;
      
      const answerEditorMode = 'add';
      this.updateState({ answerEditorMode, newAnswerQuestionId });
   }

   editAnswerCaption = (answerBeingEdited) => {
      const answerEditorMode = 'edit';
      this.updateState({ answerEditorMode, answerBeingEdited });
   }

   closeAnswerEditor = async (data) => {

      if (data) {
         if (this.state.answerEditorMode === 'add') {
            await this.addAnswerToTree(data);
         } else {
            const id = this.state.answerBeingEdited.id;
            await this.updateAnswerOnTree(id, data);
         }
      }

      const answerEditorMode = null;
      const newAnswerQuestionId = null;
      const answerBeingEdited = null;
      
      await this.updateState({ answerBeingEdited, newAnswerQuestionId, answerEditorMode });

   }

   fetchAnswers = async () => {

      try {
         showLoading();

         const res = await request.get('/api/answers');
         const answers = generateAnswerTree(res.data);

         this.updateState({
            answers,
            answersFetched: true
         });
         
      } catch (err) {
         swal(String(err))
      } finally {
         hideLoading();
      }
   }


   componentDidMount() {

      super.componentDidMount();

      if (!window.App.authenticated) {
         return window.App.redirect('/login');
      }

      this.fetchAnswers();

   }

   _render() {

      if (!this.state.answersFetched) {
         return <div className="vh-align fill-container">
            <div className="max-w-[300px]">
               <p className="text-xl text-gray-600">Failed to load configurations.</p>
               <Button onClick={this.fetchAnswers}>
                  RETRY
               </Button>
            </div>
         </div>
      }


      let answersJSX;

      if (this.state.answers.length > 0) {

         const actions = {
            editCaption: this.editAnswerCaption,
            delete: this.removeAnswerFromTree,
            update: this.updateAnswerOnTree,
            addResponse: this.addAnswer,
            deleteChildren: this.deleteAnswerByParentId,
         }

         answersJSX = this.state.answers.map(answer => {
            return <Answer {...answer} key={answer.id} actions={actions} />
         })
         
      } else {
         answersJSX = <p className="text-xl text-gray-600">
            Nothing added yet
         </p>
      }

      return <div className="p-4">
         <h1 className="text-gray-500 text-3xl">
            What problem are you facing?

            <Button onClick={this.addAnswer} variant="contained" size="small" startIcon={<AddIcon />}>
               ADD
            </Button>

            <AnswerEditor
               mode={this.state.answerEditorMode}
               data={this.state.answerBeingEdited}
               questionId={this.state.newAnswerQuestionId}
               close={this.closeAnswerEditor}
            />

         </h1>
         {answersJSX}
      </div>
   }
}