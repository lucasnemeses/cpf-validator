(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const input = document.querySelector('[data-mask]');
        const btn = document.querySelector('[data-btn]');
        const result = document.querySelector('[data-result]');

        const mask = IMask(input, { mask: '000.000.000-00' });
        const validator = new CPFValidador(input, btn, result);
        validator.init();
    });

    function CPFValidador(input, btn, result) {
        this.input = input;
        this.btn = btn;
        this.result = result;
    }

    CPFValidador.prototype.init = function() {
        this.btn.addEventListener('click', () => this.validate());    
        this.input.addEventListener('keypress', event => {
            if (event.key === 'Enter')
                this.validate();
        });
    }

    CPFValidador.prototype.validate = function() {
        if (!this.input.value) {
            this.warning('O campo CPF é obrigatorio.');
            return;
        }

        let cpf = this.input.value.replace(/\D/g,'').split('');
        
        if (cpf.length !== 11) {
            this.warning('CPF inválido.');
            return;
        }
        
        cpf = cpf.map(value => parseInt(value)); 
        const validade = [];

        [10, 11].forEach(element => {
            const length = element - 12;
            const array = [...cpf];
            const digit = array.splice(length, Math.abs(length));
            const reduce = array.reduce((amount, value, index) => {
                return amount += value * (element - index);
            },0);
            const calc = 11 - (reduce % 11);
            const result = (calc > 9 ? 0 : calc) == digit[0];

            validade.push(result ? 1 : 0);
        });

        if (validade.reduce((amount, value) => amount += value) !== 2) {
            this.warning('CPF inválido.');
        } else {
            this.success();
        }
    }

    CPFValidador.prototype.warning = function(message) {
        if (!this.input.classList.contains('input-fail'))
            this.input.classList.add('input-fail');
        
        if (!this.result.classList.contains('alert-fail'))
            this.result.classList.add('alert-fail');

        this.result.innerText = message;
    }

    CPFValidador.prototype.success = function() {
        if (this.input.classList.contains('input-fail'))
            this.input.classList.remove('input-fail');
        
        if (this.result.classList.contains('alert-fail'))
            this.result.classList.remove('alert-fail');

        this.result.innerText = 'CPF válido.';
    }
})();