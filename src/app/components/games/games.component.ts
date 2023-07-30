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
      let player1 = 0;
      let player2 = 0;
      let pos = 0;

      if(num_rondas < 10000){

        if(lines.length == num_rondas+1){
          
          for(let i=1; i<lines.length; i++){

            //si encuntra un salto de linea
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

            if(puntos[0] > puntos[1]){//ronda ganada por jugador 1
              if(player1 < puntos[0]-puntos[1])
                player1 = puntos[0]-puntos[1];
            } else {//ronda ganada por jugador 2
                if(puntos[1] > puntos[0]){
                  if(player2 < puntos[1] - puntos[0])
                    player2 = puntos[1] - puntos[0];
                } else {//empate
                  if(player1 < puntos[0]-puntos[1])
                    player1 = puntos[0]-puntos[1];
                  if(player2 < puntos[1]-puntos[0])
                    player2 = puntos[1]-puntos[0];
                }    
              } 
          }  

          if(this.errors.length > 0){
            this.strResp = "";
          } else {
            this.writeFile(player1, player2);
          }

        } else {//no existen todas las rondas en el archivo
          this.errors.push('Faltan datos de rondas');
        }

      } else {
        this.errors.push("No puede haber mas de 10000 rondas");        
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

  writeFile(player1:number, player2:number){

    let winner = "";
    let points = 0;
    if(player1 > player2){
      winner = "1";
      points = player1;
    } else {
      winner = "2";
      points = player2;
    }
      
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
