import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Component from "@xavisoft/react-component";
import { errorToast }  from '../toast'
import swal from "sweetalert";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import { delay } from "../utils";


export default class SolutionEditor extends Component {

   submit = async () => {
      const txtSolution = document.getElementById('txt-solution');
      const solution = txtSolution.value;

      if (!solution) {
         errorToast('Provide solution');
         return txtSolution.focus();
      }

      const data = { solution };

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
         document.getElementById('txt-solution').value = this.props.data.solution;
      }

   } 

   render() {

      const title = this.props.mode === 'add' ? 'Add solution' : 'Edit solution';
      const shrink = this.props.mode === 'edit' ? true : undefined;

      return <Dialog open={!!this.props.mode}>

         <DialogTitle>{title}</DialogTitle>
         
         <DialogContent>
            <div className="[&>*]:my-1 max-w-[300px]">
               <TextField
                  variant="standard"
                  id="txt-solution"
                  label="Solution"
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