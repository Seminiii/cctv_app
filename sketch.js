let cam;
let rearSetting;


// let myVideoRec;

let detector;

let canvas;
let state=0

/////////////////////// 이미지를 위한 변수 선언//////////////////////////

let current_time = [];
let passengers = [];
let recording_time = [];
let saved =[];


//////////////////////레코딩 타임////////////

let miliSeconds1 = 0;
let miliSeconds2 = 0;
let seconds1 = 0;
let seconds2 = 0;
let minutes1 = 0;
let minutes2 = 0;
let hours1 = 0;
let hours2 = 0;

let recordingTime = '00:00:00'; 
let recordingStartTime = 0;
let pausedStartTime = 0; 
let pausedTime = 0; 
let totalPausedTime = 0; 


let angle = 0;

let peopleNumber = 0;

let detectedObjects = [];

let myWriter;
let writerMsg;


function preload(){
  detector = ml5.objectDetector('cocossd');
    
  
  current_time = loadImage('image/currnet time.png');
  passengers = loadImage('image/passengers.png');
  recording_time = loadImage('image/recording time.png');
  
  startButton = loadImage('image/button ver.2.png');
  stopButton = loadImage('image/001_G_button _SAVED.png');
  pausedButton = loadImage('image/001_G_button _PAUSED.png');
  pauseButton = loadImage('image/001_G_button _RECORDING.png');
  pauseRotate = loadImage('image/rotate.png');
  saved = loadImage('image/SAVED!.png');
}

function setup() {
  
  rearSetting = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment"  //rear
      }
    }
  }                                                  //후면카메라 
  
  createCanvas(844, 390);
  //cam = createCapture(rearSetting);
  cam = createCapture(VIDEO);
  cam.size(644,483);
  cam.position(0,0);
  cam.hide();
  
  // myVideoRec = new P5MovRec();
  
  angleMode(DEGREES);
  
  detector.detect(cam, gotDetections);

}


function draw() {
  background(120);
  
  drawVideoPreview(0,0,644,483);

  doCOCOSSD(state);
  
  drawMainpage();
  drawButtons(state);
  wirteLog(state);
  
  peopleNumber = 0;
}
function drawVideoPreview(x,y,w,h){
    image(cam,x,y,w,h);

}

function drawMainpage(){
   ///////////////background_RIGHT_BK///////////////////
//BACKGROUND
  fill(0);
  rect(644,0,300,390);
  
//GREY TEXTBOX
  image(current_time,656,46);
  image(recording_time,656,75);
  image(passengers,657,102);

                     //////////////현재시각 표기///////////////
  let yr = year();
  let mon = month();
  let dd = day();
  let hr = hour();
  let mm = minute();
  let sc = second();
  
  fill(255);
  noStroke();
  textSize(14);
  text (nf(hr,2,0) + ':' + nf(mm,2,0) + ':' + nf(sc,2,0), 776,61); //인터페이스 시계
  text (yr +'.' + nf(mon,2,0) + '.'+ nf(dd,2,0) + ' ' + nf(hr,2,0) + ':' + nf(mm,2,0) + ':' + nf(sc,2,0),20,354,180,20); //왼쪽하단시계

  
              //////////////레코딩타임 박스///////////////
//배경
  fill(55,68,73,50);
  rect(272,10,100,30,5);  
  
//COUNT UP TIMER
  
  noStroke();
  
  let recordingTime = '0'+hours2+':'+minutes1+minutes2+':'+seconds1+seconds2;
  

  textSize(16);
  fill(255);
  text(hours1,282,30);
  text(hours2,292,30);
  text(":",306,29)
  text(minutes1,314,30);
  text(minutes2,324,30);
  text(":",336,29)
  text(seconds1,344,30);
  text(seconds2,354,30);      //상단중앙
  
  textSize(14);
  text(recordingTime,776,90);
     //우측
  text(peopleNumber, 776, 120);
}

function drawButtons(){
  
  if (state==0){
  //START BUTTON
    image(startButton,714,278);
  }else if (state==1){
 //레코딩 타임박스 색상 변경 (핑크)
    fill(232,53,113);       
    rect(272,10,100,30,5); 
    
    noStroke();
    textSize(16);
    fill(255);
    text(hours1,282,30);
    text(hours2,292,30);
    text(":",306,29)
    text(minutes1,314,30);
    text(minutes2,324,30);
    text(":",336,29)
    text(seconds1,344,30);
    text(seconds2,354,30); 
    
    
  //STOP BUTTON
    image(stopButton,770,292);  
    
  //PAUSED BUTTON
    imageMode(CENTER);
    image(pauseButton,711,312);
    translate(711,312);
    rotate(angle);
    image(pauseRotate,0,0);
    
    angle = angle +1;

    translate(0,0);
    imageMode(CORNER);
    
  
  //레코딩 타임 시작 
    miliSeconds2 = frameCount%10;
    if(frameCount % 6 == 0 && miliSeconds1 >= 0){
      miliSeconds1++;
      if(miliSeconds1 == 10){
        miliSeconds1=0;
        seconds2+=1;
        if(seconds2==10){
          seconds2=0;
          seconds1+=1;
          if(seconds1==6){
            seconds1=0;
            seconds2=0;
            minutes2+=1;
            if(minutes2==10){
             seconds2=0;
             seconds1=0;
             minutes2=0;
             minutes1+=1;
            if(minutes1==6){
              seconds2=0;
              seconds1=0;
              minutes2=0;
              minutes1=0;
              hours2+=1;
              if(hours2==10){
                seconds2=0;
                seconds1=0;
                minutes2=0;
                minutes1=0;
                hours2=0;
                hours1+=1;
              }   
            } 
          } 
        }
      } 
    }

    }
  }else if(state==2){
    
    //STOP BUTTON
    image(stopButton,771,292);  
    
    //PAUSED BUTTON
    imageMode(CENTER);
    image(pausedButton,711,312);
    imageMode(CORNER);
    
  }else if(state ==3){
    
    //SAVED BUTTON
    image(saved,714,278);
    }
}

function gotDetections(error, results){
  if(error){
    console.error(error);
  }
  detectedObjects = results;
  detector.detect(cam,gotDetections);
}

/////////////////////////////////버튼 작동//////////////////////
function mouseReleased(){
  
  if (state==0){
    if(dist(mouseX, mouseY, 744,308) <= 30){    //START BUTTON 
      // fullscreen(true);
      state=1;
      recordingStartTime = millis();
      startLog();
      // myVideoRec.startRec();
    } 
  }else if(state==1){
    if(dist(mouseX, mouseY, 711,312) <= 30){    //PAUSED BUTTON
      state=2;
      pausedSartTime = millis();
    }
    if (dist(mouseX, mouseY, 790,312) <= 30){ // 초기화 (main page로 돌아가기 )
       state=3;
       initializeTime();
       saveLog();
       // myVideoRec.stopRec();
    }
   
  }else if(state==2){
    if (dist(mouseX, mouseY, 771,312) <= 30){   //PAUSED BUTTON 다시시작 
       state=1; 
       totalPausedTime = totalPausedTime + pausedTime;
    }
    if (dist(mouseX, mouseY, 790,312) <= 30){ // 초기화 (main page로 돌아가기 )
       state=3;
       initializeTime();
       saveLog();
       // myVideoRec.stopRec();
    }                 
    }else if(state == 3){
      if(dist(mouseX, mouseY, 744,308) <= 30){
        state =0;
      }
    }
  }

function initializeTime(){
    miliSeconds1 = 0;
    miliSeconds2 = 0;
    seconds1 = 0;
    seconds2 = 0;
    minutes1 = 0;
    minutes2 = 0;
    hours1 = 0;
    hours2 = 0;
   recordingStartTime = 0;
   pausedStartTime = 0;
   pausedTime = 0;
   totalPausedTime = 0;
}

function calculateRecordingTime(){
    let cur_time = millis();
  
  if(state == 0){ 
    recordingTime = '00:00:00';
  }else if(state == 1){ 
    let rec_time = cur_time - recordingStartTime - totalPausedTime;
    let rec_sec = int(rec_time / 1000) % 60;
    let rec_min = int(rec_time / (1000*60)) % 60;
    let rec_hour = int(rec_time / (1000*60*60)) % 60;
    
    recordingTime = ''+nf(rec_hour,2,0)+':'+nf(rec_min,2,0)+':'+nf(rec_sec,2,0);
  }else if(state == 2){ 
    pausedTime = millis() - pausedStartTime;
  }else if(state == 3){ 
    recordingTime = '00:00:00';
  }
}

/////////////////////////////COCOSSD ADDED//////////////////////
function doCOCOSSD(){
  let tempMsg ='';
  for (let i = 0; i < detectedObjects.length; i++) {
    let object = detectedObjects[i];
    
    if(object.label == 'person'){
      peopleNumber = peopleNumber +1;
      
      stroke(232,53,113);
      strokeWeight(4);
      noFill();
      rect(object.x, object.y, object.width, object.height);
      noStroke();
      fill(232,53,113);
      textSize(14);
      text(object.label+' '+peopleNumber, object.x, object.y -5);
      
      let centerX = object.x + (object.width/2);
      let centerY = object.y + (object.height/2);
      strokeWeight(6);
      stroke(232,53,113);
      point(centerX, centerY);
      noStroke();
      
      tempMsg = tempMsg+','+peopleNumber+','+centerX+','+centerY;
      /////개별 사람마다 X,Y좌표값
    }
  }
  let millisTime = int(millis() - recordingStartTime - totalPausedTime);
  writerMsg = ''+recordingTime+','+millisTime+','+peopleNumber+''+tempMsg;
}
////////////////////////WRITER ADDED/////////////////
function startLog(){
  let mm = nf(month(),2,0);
  let dd = nf(day(),2,0);
  let ho = nf(hour(),2,0);
  let mi = nf(minute(),2,0);
  let se = nf(second(),2,0);
  

  let fileName = 'data_'+ mm + dd +'_'+ ho + mi + se+'.csv';
  
  myWriter = createWriter(fileName);
}
function saveLog(){
    myWriter.close();
    myWriter.clear();
}
function wirteLog(currentState){
  if(currentState==1){
    myWriter.print(writerMsg);
  }
}