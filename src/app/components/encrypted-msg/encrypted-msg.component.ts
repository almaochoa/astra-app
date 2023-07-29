import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-encrypted-msg',
  templateUrl: './encrypted-msg.component.html',
  styleUrls: ['./encrypted-msg.component.scss']
})

export class EncryptedMsgComponent implements OnInit {

    public content: any;
    public errors:string[] = [];
    public response:string[] = [];
    public lenM1: number=0;
    public lenM2: number=0;
    public lenN: number=0;
    public strResp: string = "";
    public strErrors:string  = "";
  
    constructor(){
         this.content = "";
         console.log("constructor");
    }

    ngOnInit(): void {
      console.log("oninit");
    }

    clearVariables(){
      this.errors = [];
      this.response = [];
    }

    async onFileSelected(event: any){

      let file = event.target.files[0];
      await this.readFileContent(file);
      this.strErrors = "";
      this.strResp = "";
    } 

    onProcessFile(){

      this.clearVariables();

      //si el archivo tiene contenido
      if(this.content){

        //toma las lineas del archivo
        let lines = this.content.split('\n');

        if(lines.length != 4){//si el archivo no tiene 4 lineas
          this.errors.push("El archivo debe tener 4 lineas");
          this.response.push('NO');
          this.response.push('NO');     
        } else { 
          //revisa las lineas del archivo
          for(var line=0; line<lines.length; line++){
            if(line == 0)
              this.checkFirstLine(lines[line]);
            else
              this.validateAlfaNum(lines[line], line+1);
          }

          if(this.errors.length == 0){//Si el archivo se puede procesar
            //buscar el primer mensaje
            if(this.messageFound(lines[1], lines[3], this.lenM1)){
              this.response.push('SI');
              this.response.push('NO');
            } else if(this.messageFound(lines[2], lines[3], this.lenM2)){
                this.response.push('NO');
                this.response.push('SI');
            } else {
              this.response.push('NO');
              this.response.push('NO');                
            }
          } else { //si el contenido del archivo no es valido
            this.response.push('NO');
            this.response.push('NO');               
          }  
        }
      } else {
        this.errors.push("El archivo esta vacio");     
        this.response.push('NO');
        this.response.push('NO');       
      }
      
      if(this.response.length > 0)
        this.writeFile();
    
      this.strErrors = this.errors.join("<br>");
      this.strResp = this.response.join("<br>");


    }

    readFileContent(file: File): Promise<string> { 

      return new Promise<string>((resolve, reject) => { 
        if (!file) { 
          resolve(''); 
        } 
        const reader = new FileReader(); 
        reader.onload = (e) => { 
          this.content = reader.result;
          resolve(''); 
        }; 
        reader.readAsText(file); 
      }); 
    }

    writeFile(){

      let txtResp = this.response.join("\n");
      const a = document.createElement("a");
      const respFile = new Blob([txtResp], { type: 'text/plain' });
      const url = URL.createObjectURL(respFile);
      a.href = url;
      a.download = 'respuesta.txt';
      a.click();
      URL.revokeObjectURL(url);
    }    

  /**
   * Inician funciones para validar las lineas
   */

  /**
   * 
   * @param line:string
   * @returns true if all elements are numbers and kept the bounderies
   */
  checkFirstLine(line: string){
    let error1 = false;
    let elements = line.split(" ");

    try {
        elements.forEach(item => {
            if(Number.isNaN(Number.parseInt(item))){
              this.errors.push("Las entradas de la linea 1 deben ser numeros");
              error1 = true;
            }  
        });

        if(!error1){
            if(Number.parseInt(elements[0]) < 2 || Number.parseInt(elements[0]) > 50)
              this.errors.push("El primer campo de la linea 1 debe estar entre 2 y 50");
            else 
              this.lenM1 = Number.parseInt(elements[0]);  

            if(Number.parseInt(elements[1]) < 2 || Number.parseInt(elements[1]) > 50)
              this.errors.push("El segundo campo de la linea 1 debe estar entre 2 y 50");
            else
             this.lenM2 = Number.parseInt(elements[1]);    
               
            if(Number.parseInt(elements[2]) < 3 || Number.parseInt(elements[2]) > 5000)
              this.errors.push("El tercer campo de la linea 1 debe estar entre 3 y 5000");
            else
             this.lenN= Number.parseInt(elements[2]);    
               
        }      

    } catch (err){
      
    }

  }

  /**
   * Validate message and instructions like alfanumeric string
   * @param line 
   * @returns true if message and instructions are alfanumeric string
   */
  validateAlfaNum(line: string, i:number){

    if(i==2)
      line = line.substring(0,this.lenM1);
    if(i==3)
      line = line.substring(0,this.lenM2);

    console.log(line);  
 
    const regex = /^([a-zA-Z0-9]+)$/g;
    if(!regex.test(line))
      this.errors.push(`Los caracteres del renglon ${i} deben ser alfanumericos`);
 
  }

  /**
  * This function create a pattern base on msgSearch
  * separating every char and form the expreg to accepte 
  * the char 1, 2 o 3 times 
  * @param msgSearch 
  * @param msgEncrypted 
  * @returns true if msgSearch is found into msgEncrypted
  */
  messageFound(msgSearch: string, msgEncrypted: string, len:number): boolean {

    msgSearch = msgSearch.substring(0,len);
   
    let msgExpReg:string = "";
    for(let i=0; i < msgSearch.length; i++){
        msgExpReg += `(${msgSearch[i]}{1,3})`; 
    }

    const regex = new RegExp(msgExpReg);
    return regex.test(msgEncrypted);
  }
  
}
