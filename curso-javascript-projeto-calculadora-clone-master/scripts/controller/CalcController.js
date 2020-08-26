class CalcController {
    //contrutor ele é inciado automaticamente, ele chama as funções metodos criadas abaixo
    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR'
        this._displayCalEL = document.querySelector('#display')
        this._dateEl =  document.querySelector('#data')
        this._timeEl = document.querySelector('#hora')
        this._currentDate;
        this.initialize();
        this.initButtonsEvent();
        this.initKeyborad();
    
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false)
        })
    }

    pasteFromClipboard(){
        document.addEventListener( 'paste', e =>{
            
            let text =  e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text)

            console.log(text);

        });
    }


    copyToClipboard(){
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand('Copy');

        input.remove();
    }


        //tudo que inicia assim que começar a calculadora
    initialize(){
        this.setDisplayDateTime();
        setInterval(() => {
            this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
        } , 1000)

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach (btn => {

            btn.addEventListener('dblclick', e =>{

                this.toggleAudio();

            })

        });

    }

    toggleAudio(){

        this._audioOnOff =  !this._audioOnOff;

    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();

        }
    }

    initKeyborad(){
        document.addEventListener('keyup', e => {

            this.playAudio();

            switch(e.key){

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
                
                case '+':    
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });

    }

    
    clearAll(){
        this._operation = [];
        this._lastNumber = [];
        this._lastOperator = [];
        this.setLastNumberToDisplay();
    }
    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLestOperation(){
        return this._operation[this._operation.length-1]
        
    }

    setLestOperation(value){
        this._operation[this._operation.length-1] = value;
    }


    isOperator(value){
       return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    pushOperator(value){
        this._operation.push(value);  

        if (this._operation.length > 3){

            this.calc()
            console.log(this._operation)
        }
    }

    getResult(){

        try{
            return  eval(this._operation.join(""));
        } catch (e){
            setTimeout(() => {
                this.setError();
            }, 1);

        }

       
    }

    calc(){
        let last = '';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }


        if (this._operation.length > 3){
            last = this._operation.pop();
            console.log("Validando", this._operation)

            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);
        }


        let result =  this.getResult();

        if(last == '%'){
            result /= 100;
            this._operation = [result];
        } else {
            
            this._operation = [result];

            if(last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true ){
        let lastItem;
        for(let i = this._operation.length-1; i >= 0; i --) {

            if(this.isOperator( this._operation[i]) == isOperator){
                lastItem =  this._operation[i];
                break;
            }
        }
        if ( !lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
      
        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }

    addOperation(value){
        console.log('a', isNaN(this.getLestOperation()));

        if (isNaN(this.getLestOperation())){

            if (this.isOperator(value)){

                this.setLestOperation(value);

            } else {
                this.pushOperator(value);
                this.setLastNumberToDisplay()

            }

        } else{
            if(this.isOperator(value)){

                this.pushOperator(value);

            } else {

                let newValue = this.getLestOperation().toString() + value.toString();
                this.setLestOperation(newValue);
                this.setLastNumberToDisplay()
                console.log('New', newValue)
            }

        }


        console.log(this._operation)
    }
    setError(){
        this.displayCalc = 'Error'
    }

    addDot(){
       let lastOperation = this.getLestOperation();

       if (typeof lastOperation === 'string' && lastOperation.split('').indexOf(".") > -1) return;

       if (this.isOperator(lastOperation) || !lastOperation){
           this.pushOperator("0.")
       }else {
           this.setLestOperation(lastOperation.toString() + ".");
       }
       this.setLastNumberToDisplay();
    }

    execBtn(value){
        this.playAudio();
        switch(value){

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;
            
            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;
            
            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvent (){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g") //pegue todas as tags G que são filhas de button e tags g que são filhas de parts
        
        buttons.forEach((btn , index) =>{
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = (btn.className.baseVal.replace("btn-", "")); //substituindo por nada
                this.execBtn(textBtn)
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{} )
                btn.style.cursor = "pointer" //mão
        })
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }


    get displayTime(){
        return this._timeEl.innerHTML;

    }

    set displayTime(value){
        return this._timeEl.innerHTML = value
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value
    }

    get displayCalc(){
        return this._displayCalEL.innerHTML;
    }

    set displayCalc(value){

        if (value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalEL.innerHTML = value;
    }

    get currentDate(){
      return  new Date();       
    }

    set currentDate(data){
        this._currentDate = data;
    }
} // Class - o que importa é o que esta dentro dela.