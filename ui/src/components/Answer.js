import {  Button, Divider, IconButton } from "@mui/material";
import Component from "@xavisoft/react-component";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { requestConfirmation } from "../utils";
import { hideLoading, showLoading } from "../loading";
import swal from "sweetalert";
import request from "../request";
import SolutionEditor from "./SolutionEditor";
import QuestionEditor from "./QuestionEditor";




export default class Answer extends Component {

   state = {
      expanded: false,
      solutionEditorMode: null,
      questionEditorMode: null,
   }

   updateState = (update={}) => {
      return new Promise(resolve => {
         this.setState({ ...this.state, ...update }, resolve);
      });
   }

   toggleExpansion = () => {
      const expanded = !this.state.expanded;
      return this.updateState({ expanded })
   }


   addResponse = () => {
      this.props.actions.addResponse(this.props.id);
   }


   editAnswer = () => {
      const id  = this.props.id;
      const caption = this.props.caption;
      this.props.actions.editCaption({ id, caption });
   }

   deleteAnswer = async () => {

      const question = `Delete response "${this.props.caption}"?`
      const confirmation = await requestConfirmation({ question });

      if (!confirmation)
         return;

      try {

         showLoading();

         const id  = this.props.id;
         await request.delete(`/api/answers/${id}`)
         this.props.actions.delete(id);

      } catch (err) {
         swal(String(err))
      } finally {
         hideLoading();
      }

      
   }

   addSolution = () => {
      const solutionEditorMode = 'add';
      return this.updateState({ solutionEditorMode });
   }

   editSolution = () => {
      const solutionEditorMode = 'edit';
      return this.updateState({ solutionEditorMode });
   }

   deleteSolution = async () => {

      const question = `Do you want to delete the solution "${this.props.solution}"?`

      const confirmation = await requestConfirmation({ question });
      if (!confirmation)
         return;

      try {

         const solution = null;
         const id = this.props.id;
         const updates = { solution };

         await request.patch(`/api/answers/${id}`, updates);
         this.props.actions.update(id, updates);
         
      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   closeSolutionEditor = async (data) => {

      if (data) {
         await this.props.actions.update(this.props.id, data);
      }

      const solutionEditorMode = null;
      await this.updateState({ solutionEditorMode });
   }

   addFollowupQuestion = () => {
      const questionEditorMode = 'add';
      return this.updateState({ questionEditorMode });
   }

   editFollowupQuestion = () => {
      const questionEditorMode = 'edit';
      return this.updateState({ questionEditorMode });
   }

   deleteFollowupQuestion = async () => {

      const question = `Do you want to delete the question "${this.props.sub_question}"?`

      const confirmation = await requestConfirmation({ question });
      if (!confirmation)
         return;

      try {

         const sub_question = null;
         const id = this.props.id;
         const updates = { sub_question };

         await request.patch(`/api/answers/${id}`, updates);
         await this.props.actions.update(id, updates);
         await this.props.actions.deleteChildren(id);
         
      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   closeQuestionEditor = async (data) => {

      if (data) {
         await this.props.actions.update(this.props.id, data);
      }

      const questionEditorMode = null;
      await this.updateState({ questionEditorMode });
   }

   render() {

      let expandedJSX, ToggleExpansionIcon;

      if (this.state.expanded) {

         ToggleExpansionIcon = KeyboardArrowDownIcon;

         let subQuestionJSX, solutionJSX, noNothingJSX;

         if (this.props.sub_question) {

            let subQuestionAnswersJSX;

            if (this.props.answers && this.props.answers.length > 0) {
               const actions = this.props.actions;
               subQuestionAnswersJSX = this.props.answers.map(item => <Answer {...item} key={item.id} actions={actions} />);
            } else {
               subQuestionAnswersJSX = <p className="text-grey-500">
                  No responses to the sub-question. Please add.
               </p>
            }

            subQuestionJSX = <>

               <Divider className="my-4" />

               <span className="text-gray-600 text-sm mt-1 mb-3">

                  <b>Sub-question</b>: {this.props.sub_question}

                  <IconButton className="ml-2" size="small" onClick={this.addResponse}>
                     <AddIcon />
                  </IconButton>

                  <IconButton size="small" onClick={this.editFollowupQuestion}>
                     <EditIcon />
                  </IconButton>

                  <IconButton size="small" onClick={this.deleteFollowupQuestion}>
                     <DeleteIcon />
                  </IconButton>
               </span>

               {subQuestionAnswersJSX}
            </>
         } else if (this.props.solution) {

            solutionJSX = <>
               <Divider className="my-4" />

               <span className="text-gray-600 text-sm mt-1 mb-3">
                  <b>Solution</b>: {this.props.solution}

                  <IconButton className="ml-2" size="small" onClick={this.editSolution}>
                     <EditIcon />
                  </IconButton>

                  <IconButton size="small" onClick={this.deleteSolution}>
                     <DeleteIcon />
                  </IconButton>
               </span>
            </>
         } else {

            noNothingJSX = <>
               <Divider className="my-4" />

               <div>
                  <Button startIcon={<AddIcon />} size="small" onClick={this.addSolution}>
                     ADD SOLUTION
                  </Button>

               </div>

               <div>
                  <Button startIcon={<AddIcon />} size="small" onClick={this.addFollowupQuestion}>
                     ADD FOLLOWUP QUESTION
                  </Button>
               </div>
            </>

         }

         const modalsJSX = <>
            <SolutionEditor
               mode={this.state.solutionEditorMode}
               close={this.closeSolutionEditor}
               data={{ 
                  id: this.props.id,
                  solution: this.props.solution,
               }}
            />

            <QuestionEditor
               mode={this.state.questionEditorMode}
               close={this.closeQuestionEditor}
               data={{ 
                  id: this.props.id,
                  sub_question: this.props.sub_question,
               }}
            />
         </>

         expandedJSX = <>
            {solutionJSX}
            {subQuestionJSX}
            {noNothingJSX}
            {modalsJSX}
         </>
      } else {
         ToggleExpansionIcon = KeyboardArrowRightIcon;
      }

      return <div
         style={{
            display: 'grid',
            gridTemplateColumns: '40px auto',
         }}
      >
         <div>
            <IconButton onClick={this.toggleExpansion} className="mt-1 text-3xl">
               <ToggleExpansionIcon />
            </IconButton>
         </div>

         <div>
            <div className="text-grey-900 text-xl pt-2">
               {this.props.caption}

               <IconButton className="ml-2" size="small" onClick={this.editAnswer}>
                  <EditIcon />
               </IconButton>

               <IconButton size="small" onClick={this.deleteAnswer}>
                  <DeleteIcon />
               </IconButton>
            </div>
            {expandedJSX}
         </div>
      </div>
   }
}