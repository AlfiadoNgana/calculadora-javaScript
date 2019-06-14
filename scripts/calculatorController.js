class calculatorController{
    
    constructor(){
        this._displayCalcEl = document.getElementById("display");
        this._operation = [];
        this._lastNumber = "";
        this._lastOperator = "";
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;

        this.initButtonsEvents();
        this.toggleAudio();
        this.initKeyBoard();
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        if(value.toString().length>13){
            //set error on display
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }


    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }


    initKeyBoard(){
        document.addEventListener('keyup', e=>{
            switch(e.key){
                case "Escape": this.playAudio();this.clearAll();break;
                case "Backspace": this.playAudio();this.clearEntry();break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.playAudio();this.addOperation(e.key);
                    break;
                case "Enter":
                    this.playAudio();this.calc();
                    break;
                case ".":
                case ",":
                    this.playAudio();this.addDot();
                    break;
                
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.playAudio();this.addOperation(parseInt(e.key));
                    break;
            }
        });
    }

    //methodo to add events for any element
    /**
     * 
     * @param { one element (button, h1, etc)} element 
     * @param {any events, separate with blanck spaces ("click drag mouseover etc")} events 
     * @param {function for the element or events} fn 
     */
    addEventListenerAll(element, events, fn){
        events.split(" ").forEach(event=>{
            element.addEventListener(event,fn, false);
        });
    }

    //add events click and drag for all buttons
    initButtonsEvents(){
        //first get all buttons
        /**
         * document.getElementsByTagName(button);
         * document.querySelectorAll(".btn-number, .btn-others");
         * document.getElementByClassName(".btn");
         */
        let buttons = document.querySelectorAll(".btn-number, .btn-others");
        buttons.forEach((btn, index)=>{
            //add events
            this.addEventListenerAll(btn,"click drag", e=>{
                let textBtn = btn.innerHTML;
                this.execBtn(textBtn);
            });
            //add events with the same behavior
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{
                btn.style.cursor = "pointer";
            });
        });
    }

    addRemoveClass(value){
        let buttons = document.querySelectorAll(".btn-others");
       for(let i=0; i<buttons.length; i++){
        if(value == buttons[i].innerHTML){
            let btOp = document.getElementsByClassName("activeOperator")[0];
            if(btOp){
                btOp.className = buttons[i].className;
                buttons[i].className = buttons[i].className + " activeOperator";
                break;
            }else{
                buttons[i].className = buttons[i].className + " activeOperator";
                break;
            }
        }
       }
        
    }

    addOperation(value){
        if(isNaN(this.getLastOperation())){
            //is text
            if(this.isOperator(value)){
                //change the operator
                this.setLastOperation(value);
                

            }else{
                //outra coisa
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }else{
            //is number or first operator
            if(this.isOperator(value)){
                this.pushOperation(value);
            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                
                this.setLastNumberToDisplay();
            }
            
        }

    }

    addDot(){
        let lastOperation = this.getLastOperation();
        if(typeof lastOperation =='string' && lastOperation.split('').indexOf('.') > -1) return;
        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + ".");
        }
        this.setLastNumberToDisplay();
    }

    execBtn(value){
        this.playAudio();
        switch(value){
            case "C":   this.clearAll();break;
            case "CE":  this.clearEntry();break;
            case "←":   this.clearOne();break;
            case "+":
            case "-":
            case "*":
            case "/":
            case "%":
            case "√":
            case "x²":
            case "¹/x": 
                this.addOperation(value);this.addRemoveClass(value);
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value));
                break;
            case "=":   this.calc();let btOp = document.getElementsByClassName("activeOperator")[0];
                       if(btOp){  btOp.className = "btn btn-others col-sm";}break;
            case ",":   this.addDot();break;
            default:    this.setError();
        }
    }

    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3 || this._operation.length == 2){
            this.calc();
        }
    }

    getLastItem(isOperator = true){
        let lastItem;
        for(let i=this._operation.length-1; i>=0; i--){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];break;
            }
        }
        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        if(!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }

    calc(){ 
        let last = "";
        //get the last operator
        this._lastOperator = this.getLastItem();
        if(this._operation.length ==2 && this.isOperator(this._lastOperator,false)){
            last = this._operation.pop();
            
            let result = this.getLastItem(false);
            if(last == "x²"){
                result= result*result;
                this._operation = [result];
            }else if(last == "√"){
                result = Math.sqrt(result);
                this._operation = [result];
                console.log(result);
            }else if(last == "¹/x"){
                result = 1/result;
                this._operation = [result];
            }
        }else{
            if(this._operation.length<3){
                if(this._lastNumber<0 || this._lastNumber>0){
                    let firstItem = this._operation[0];
                    this._operation = [firstItem, this._lastOperator, this._lastNumber];
                }
            }
            let verifica = false;
            if(this._operation.length >3){
                last = this._operation.pop();
                //calc
                this._lastNumber = this.getResult();
                verifica = true;
            }else if(this._operation.length == 3){
                this._lastNumber = this.getLastItem(false);
                verifica = true;
            }
            if(verifica){
                let result = this.getResult();
            if(last == "%"){
                result = result /100;
                this._operation = [result];
            }else if(last == "x²"){
                result= result*result;
                this._operation = [result];
            }else if(last == "√"){
                result = Math.sqrt(result);
                this._operation = [result];
            }else if(last == "¹/x"){
                result = 1/result;
                this._operation = [result];
            }
            else{
                this._operation = [result];
                if(last) this._operation.push(last);
            }
            //when the user click all time on equal
            
            this.setLastNumberToDisplay();
            }
        }
    }

    getResult(){
        try {
            return eval(this._operation.join(""));
        } catch (e) {
            setTimeout(()=>{
                this.setError();
            },1);
        }
    }

    isOperator(value, all =true){
        if(all)
            return (['+','-','*','%','/','¹/x','√','x²'].indexOf(value) > -1);
        else
            return (['¹/x','√','x²'].indexOf(value) > -1);
    }

    //clear one number ou operator
    clearOne(){
        //get the last element number
        let lastItem = this.getLastOperation();
        if(this.isOperator(lastItem)){
            this.clearEntry();
        }else{
           if(lastItem.indexOf("-") >-1){
                if(lastItem.length-1 >=2){
                    //2 numbers or more
                    lastItem = lastItem.replace(lastItem.charAt(lastItem.length-1),"");
                    this.setLastOperation(lastItem);
                    this.setLastNumberToDisplay();
                }else{
                    //one number
                    this.clearEntry();
                }
           }else{
                if(lastItem.length >=2){
                    //2 numbers or more
                    lastItem = lastItem.replace(lastItem.charAt(lastItem.length-1),"");
                    this.setLastOperation(lastItem);
                    this.setLastNumberToDisplay();
                }
                else{
                    this.clearEntry();
                }
           }
        }
    }
    //clear entry
    clearEntry(){
        let last=this._operation.pop();
        this.setLastNumberToDisplay();
        if(this.isOperator(last)){
            let btOp = document.getElementsByClassName("activeOperator")[0];
            if(btOp){
                btOp.className = "btn btn-others col-sm";
            }
        }
    }
    //clear all method
    clearAll(){
        this._operation = [];
        this._lastNumber ='';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
        let btOp = document.getElementsByClassName("activeOperator")[0];
        if(btOp){
            btOp.className = "btn btn-others col-sm";
        }

    }

    //set error
    setError(){
        this.displayCalc = "Error";
    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }
}