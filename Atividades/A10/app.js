const masks = {
    cpf (value) {
      return value
        .replace(/\D+/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    },
  

    phone (value) {
      return value
        .replace(/\D+/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
        .replace(/(-\d{4})\d+?$/, '$1')
    },
  
  
    cep (value) {
      return value
        .replace(/\D+/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1')
    },
  

  
    date (value) {
      return value
        .replace(/\D+/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\/\d{2})(\d)/, '$1/$2')
        .replace(/(\/\d{4})\d+?$/, '$1')
    },
  
    hour (value) {
      return value
        .replace(/\D+/g, '')
        .replace(/(\d{2})(\d)/, '$1:$2')
        .replace(/(:\d{2})\d+?$/, '$1')
    },
  }
  
  document.querySelectorAll('input').forEach($input => {
    const field = $input.dataset.js
  
    $input.addEventListener('input', e => {
      e.target.value = masks[field](e.target.value)
    }, false)
  })


  const button = document.getElementById('button')

  button.addEventListener('click', (event) => {
      event.preventDefault()

      const cpf = document.getElementById('cpf')
      const phone = document.getElementById('phone')
      const cep = document.getElementById('cep')
      const date = document.getElementById('date')
      const hour = document.getElementById('hour')
      
      
      let cpf_sm = cpf.value;
      cpf_sm.replace(/\./g,'').replace(/-/g,'')
               
      const cpfValido = validarCpf(cpf_sm);  
                                     
      console.log(cpf);
      
      if (cpf.value == '') {
        cpf.classList.add("errorInput")
        alert('O campo CPF não pode estar vazio!')
      } else {
        if (cpfValido == false){
            cpf.classList.add("errorInput")
            alert('CPF inválido!')
        } else {
            cpf.classList.remove("errorInput")
        }
    }


      if (phone.value == '') {
        phone.classList.add("errorInput")
        alert('O campo Telefone não pode estar vazio!')
      }  else {
        phone.classList.remove("errorInput")
    }

      if (cep.value == '') {
        cep.classList.add("errorInput")
        alert('O campo CEP não pode estar vazio!')
      }  else {
        cep.classList.remove("errorInput")
    }

      if (date.value == '') {
        date.classList.add("errorInput")
        alert('O campo Data não pode estar vazio!')
      }  else {
        date.classList.remove("errorInput")
    }

      if (hour.value == '') {
        hour.classList.add("errorInput")
        alert('O campo Hora não pode estar vazio!')
      }  else {
        hour.classList.remove("errorInput")
    }


    function validarPrimeiroDigito(cpf) {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          sum += cpf[i] * (10 - i);
        }
        const resto = (sum * 10) % 11;
        if (resto < 10) {
          return cpf[9] == resto;
        }
        return cpf[9] == 0;
      }
      
    function validarSegundoDigito(cpf) {
        let sum = 0;
        for (let i = 0; i < 10; i++) {
          sum += cpf[i] * (11 - i);
        }
        const resto = (sum * 10) % 11;
        if (resto < 10) {
          return cpf[10] == resto;
        }
        return cpf[10] == 0;
      }
      
    function validarRepetido(cpf) {
        const primeiro = cpf[0];
        let diferente = false;
        for(let i = 1; i < cpf.length; i++) {
          if(cpf[i] != primeiro) {
            diferente = true;
          }
        }
        return diferente;
      }


    function validarCpf(cpf) {
        if (cpf.length != 11) {
          return false;
        }
        if(!validarRepetido(cpf)) {
          return false;
        }
        if (!validarPrimeiroDigito(cpf)) {
          return false;
        }
        if (!validarSegundoDigito(cpf)) {
          return false;
        }
        return true;
      }

  })
