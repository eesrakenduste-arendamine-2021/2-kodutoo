class PersonData{
    constructor(name, d){
        this.name = name;
        const date = new Date(d)
        this.day = date.getDate();
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear();
    }
}


class num{
    constructor(){
        $('#addButton').on('click', ()=>{this.getResults();});
    }

    getResults(){
        var name = $('#name').val()
        var date = $('#date').val()
        console.log(name, date)
        var persondata = new PersonData(name, date)
        console.log(persondata)
        var request = JSON.stringify(persondata)
        this.makeajaxcall(request)
    }
    makeajaxcall(request){
       $.post('calc.php', {input: request}).done((data) => {
           this.handleresponse(data)
        }).fail(function(){
            alert('FAIL');
        }
        ).always(function(){
            console.log("Tegime midagi AJAXiga");
        });
    }
    handleresponse(response){
        const answers = JSON.parse(response)
        $('#answerNumbers').text(answers.allNumbers)
        $('#answerMainNumber').text(answers.mainNumber)
        $('#answerMeaning').text(answers.mainNumberMeaning)
        $('#answerContainer').show();
    }
}

new num();
