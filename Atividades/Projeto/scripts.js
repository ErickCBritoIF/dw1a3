const Modal = {
    open(){
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    close(){
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.regularMarketPriceI > 0 ) {
                
                income += transaction.regularMarketPriceI * transaction.qtd;
                
            }
        })
        return income;
    },

 /*   expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.regularMarketPriceI < 0 ) {
                expense += transaction.regularMarketPriceI;
            }
        })
        return expense;
    },

    total() {
        return  Transaction.incomes();
    }*/
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.regularMarketPriceI > 0 ? "income" : "expense"

        const regularMarketPriceI = Utils.formatCurrency(transaction.regularMarketPriceI)


        const html = `
        <td class="symbol">${transaction.symbolI}</td>
        <td class="shortName">${transaction.shortNameI}</td>
        <td class="qtd">${transaction.qtd}</td>
        <td class="${CSSclass}">${regularMarketPriceI}</td>
        <td class="date">${transaction.date}</td>

        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `

        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatregularMarketPriceI(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        
        return value
    },

    formatqtd(value){
        value = Number(value.replace(/\,\./g, ""))
        
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

       return signal + value
    }
}


const Form = {
    symbolI: document.querySelector('input#symbolI'),
    shortNameI: document.querySelector('input#shortNameI'),
    qtd: document.querySelector('input#qtd'),
    regularMarketPriceI: document.querySelector('input#regularMarketPriceI'),
    date: document.querySelector('input#date'),


    getValues() {
        return {
            symbolI: Form.symbolI.value,
            shortNameI: Form.shortNameI.value,
            qtd: Form.qtd.value,
            regularMarketPriceI: Form.regularMarketPriceI.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { symbolI, shortNameI, qtd, regularMarketPriceI, valorTotal, date } = Form.getValues()
        
        if( symbolI.trim() === "" || 
            shortNameI.trim() === "" || 
            qtd.trim() === "" ||
            regularMarketPriceI.trim() === "" ||
            date.trim() === "" 
            ) {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { symbolI, shortNameI, qtd, regularMarketPriceI, valorTotal, date } = Form.getValues()
        
        regularMarketPriceI = Utils.formatregularMarketPriceI(regularMarketPriceI)

        qtd = Utils.formatqtd(qtd)

        date = Utils.formatDate(date)


        return {
            symbolI,
            shortNameI,
            qtd,
            regularMarketPriceI,
            date
        }
    },

    clearFields() {
        Form.symbolI.value = ""
        Form.shortNameI.value = ""
        Form.qtd.value = ""
        Form.regularMarketPriceI.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}


const buscador = document.querySelector( '#symbol' );
buscador.addEventListener( 'blur',buscaDados );


function apresentarDados( data ){
    for( const campo in data ){
        
        if( document.querySelector( '#'+campo ) ){
            document.querySelector( '#'+campo ).value = data[campo]; 
        }

    }
}

function buscaDados(e){
    let busca = buscador.value;
      
    document.getElementById("visibilidade").style.display = "block";
      
      limpaForm();
    
    const option = {
        method:'get',
        mode:'cors',
        cache:'default'
    }

    //if (document.getElementById('shortName').value == "" || document.getElementById('shortName').value == " ") {
    //    document.getElementById("visibilidade").style.display = "block";
    //  } else {
    //    document.getElementById("visibilidade").style.display = "none";
    //  }


    fetch( `https://brapi.dev/api/quote/${busca}` )
    .then( ( response ) => {
        response.json()
        .then( ( data ) => { 
           
            if (data.results) {
                        apresentarDados(data.results[0]);
                        console.log(document.getElementById('shortName').value);
                    } else {
                        limpaForm();
                        document.getElementById("visibilidade").style.display = "none";
                    }
 
            
            console.log(document.getElementById('shortName').value);

        } )
    } ).catch( e => {
            console.log(e);
            limpaForm();
            document.getElementById("visibilidade").style.display = "none";
    });

}



function limpaForm()
{
    document.getElementById('shortName').value = "";
    document.getElementById('longName').value = "";
    document.getElementById('regularMarketChange').value = "";
    document.getElementById('regularMarketChangePercent').value = "";
    document.getElementById('regularMarketDayHigh').value = "";
    document.getElementById('regularMarketDayLow').value = "";
    document.getElementById('regularMarketPrice').value = "";
    document.getElementById('fiftyTwoWeekLow').value = "";
    document.getElementById('fiftyTwoWeekHigh').value = "";
    
}


App.init()
