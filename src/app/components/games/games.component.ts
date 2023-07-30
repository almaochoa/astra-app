import { Component } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {

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
      let num_rondas = lines[0];
      let puntos;
      if(lines.length == num_rondas){
        
        puntos = this.content.split('\n');  


      } else {//no existen todas las rondas en el archivo
        this.errors.push('Faltan datos de rondas');
      }

    } else {
      this.errors.push("El archivo esta vacio");        
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

}
