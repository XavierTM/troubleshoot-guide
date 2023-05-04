import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Component from "@xavisoft/react-component";
import { errorToast }  from '../toast'
import swal from "sweetalert";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import { delay } from "../utils";


export default class QuestionEditor extends Component {

   submit = async () => {
      const txtQuestion = document.getElementById('txt-question');
      const sub_question = txtQuestion.value;

      if (!sub_question) {
         errorToast('Provide follow-up question');
         return txtQuestion.focus();
      }

      const data = { sub_question };

      try {

         showLoading();

         const id = this.props.data.id;
         await request.patch(`/api/answers/${id}`, data);
         this.props.close(data);

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
      
   }

   close = () => {
      this.props.close();
   }

   async componentDidUpdate(prevProps) {
      if (this.props.mode === 'edit' && prevProps.mode === null) {
         await delay(50);
         document.getElementById('txt-question').value = this.props.data.sub_question;
      }

   } 

   render() {

      const title = this.props.mode === 'add' ? 'Add follow-up question' : 'Edit follow-up question';
      const shrink = this.props.mode === 'edit' ? true : undefined;

      return <Dialog open={!!this.props.mode}>

         <DialogTitle>{title}</DialogTitle>
         
         <DialogContent>
            <div className="[&>*]:my-1 max-w-[300px]">
               <TextField
                  variant="standard"
                  id="txt-question"
                  label="Question"
                  fullWidth
                  multiline
                  size="small"
                  InputLabelProps={{
                     shrink
                  }}
               />
            </div>
         </DialogContent>

         <DialogActions>
            <Button onClick={this.submit} variant="contained">
               SUBMIT
            </Button>
            <Button onClick={this.close} variant="text">
               CANCEL
            </Button>
         </DialogActions>
      </Dialog>   
   }
}