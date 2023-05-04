import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Component from "@xavisoft/react-component";
import { errorToast }  from '../toast'
import swal from "sweetalert";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import { delay } from "../utils";


export default class AnswerEditor extends Component {

   submit = async () => {
      const txtCaption = document.getElementById('txt-caption');
      const caption = txtCaption.value;

      if (!caption) {
         errorToast('Provide response');
         return txtCaption.focus();
      }

      const data = { caption };

      try {

         showLoading();

         if (this.props.mode === 'add') {

            data.question = this.props.questionId;

            const res = await request.post('/api/answers', data);
            const id = res.data.id;
            this.props.close({ id, ...data });
         } else {
            const id = this.props.data.id;
            await request.patch(`/api/answers/${id}`, data);
            this.props.close(data);
         }

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
         document.getElementById('txt-caption').value = this.props.data.caption;
      }

   } 

   render() {

      const title = this.props.mode === 'add' ? 'Add response' : 'Edit response';
      const shrink = this.props.mode === 'edit' ? true : undefined;

      return <Dialog open={!!this.props.mode}>

         <DialogTitle>{title}</DialogTitle>
         
         <DialogContent>
            <div className="[&>*]:my-1 max-w-[300px]">
               <TextField
                  variant="standard"
                  id="txt-caption"
                  label="Response"
                  fullWidth
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