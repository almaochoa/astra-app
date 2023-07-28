import { Component, OnInit } from '@angular/core';
//import {MatIconModule} from '@angular/material/icon';
//import { File } from './../../models/file'

@Component({
  selector: 'app-encrypted-msg',
  templateUrl: './encrypted-msg.component.html',
  styleUrls: ['./encrypted-msg.component.scss'],
  //imports:[MatIconModule],
})

export class EncryptedMsgComponent implements OnInit {

    public content: any;

    constructor(){
         this.content = "";
    }

    ngOnInit(): void {
      
    }


    
    async onFileSelected(event: any){

      let file = event.target.files[0];
      await this.readFileContent(file);
     
    } 
    
    onProcessFile(){
      if(this.content){
        let lines = this.content.split('\n');
        for(var line=0; line<lines.length; line++){
          console.log(lines[line]);
        }
      }
    }

    readFileContent(file: File): Promise<string> { 

      return new Promise<string>((resolve, reject) => { 
        if (!file) { 
          resolve(''); 
        } 
        const reader = new FileReader(); 
        reader.onload = (e) => { 
          //console.log(reader.result); 
          this.content = reader.result;
          resolve(''); 
        }; 
        reader.readAsText(file); 
      }); 
    }

  
}
