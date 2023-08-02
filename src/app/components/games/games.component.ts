import { Component } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent {

  public content: any;
  public errors:string[] = [];
  public lenM1: number=0;
  public lenM2: number=0;
  public lenN: number=0;
  public strResp: string = "";
  public strErrors:string  = "";

  constructor(){
       this.content = "";
  }

  ngOnInit(): void {
  }

  clearVariables(){
    this.errors = [];
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
      let num_rondas = Number.parseInt(lines[0]);
      let puntos;
      let pos = 0;
      let acumj1 = 0;
      let acumj2 = 0;
      let ventaja = 0;
      let jugador = "";
      let mayorVentaja = 0;
      let jugadorVentaja = "";

      if(Number.isNaN(Number.parseInt(lines[0]))){
        this.errors.push(`El valor de numeros de ronda no es un numero`);
      } else {   

        if(num_rondas < 10000){

          if(lines.length == num_rondas+1){
            
            for(let i=1; i<lines.length; i++){

              //si encuentra un salto de linea
              if(lines[i].indexOf('\r') > 0){
                  pos = lines[i].indexOf('\r');
                  lines[i] = lines[i].substring(0,pos);
              }

              puntos = lines[i].split(' ');
              //valida que sean numeros los que estan en el archivo
              if(Number.isNaN(Number.parseInt(puntos[0]))){
                this.errors.push(`El valor del jugador 1 de la ronda ${i} no es un numero`);
                break;    
              }
              if(Number.isNaN(Number.parseInt(puntos[1]))){
                this.errors.push(`El valor del jugador 2 de la ronda ${i} no es un numero`);    
                break;    
              }

              puntos[0] = Number.parseInt(puntos[0]);
              puntos[1] = Number.parseInt(puntos[1]);

              acumj1 += puntos[0];
              acumj2 += puntos[1];

              if(acumj1 > acumj2){
                ventaja = acumj1-acumj2;
                jugador = "1";
              } else if(acumj2 > acumj1) {
                  ventaja = acumj2-acumj1;
                  jugador = "2";
              }
              
              if(mayorVentaja < ventaja){
                mayorVentaja = ventaja;
                jugadorVentaja = jugador;   
              }   
            }  

            if(this.errors.length > 0){
              this.strResp = "";
            } else {
              this.writeFile(jugadorVentaja, mayorVentaja);
            }

          } else {//no existen todas las rondas en el archivo
            this.errors.push('Faltan datos de rondas');
          }

        } else {
          this.errors.push("No puede haber mas de 10000 rondas");        
        }
      }  
    } else {
      this.errors.push("El archivo esta vacio");        
    }

    this.strErrors = this.errors.join("<br>");

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

  writeFile(winner:string, points:number){
      
    let txtResp = winner + " " + points;
    const a = document.createElement("a");
    const respFile = new Blob([txtResp], { type: 'text/plain' });
    const url = URL.createObjectURL(respFile);
    a.href = url;
    a.download = 'games-resp.txt';
    a.click();
    URL.revokeObjectURL(url);

    this.strResp = txtResp;
  }    

}
