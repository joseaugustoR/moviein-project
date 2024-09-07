const digitoinput = document.querySelectorAll('.inputdigito');

digitoinput.forEach((input, index) => {
    input.addEventListener('input', function () {
        if (this.value.length > 0) {
            if (index < digitoinput.length - 1) {
                digitoinput[index + 1].removeAttribute('disabled'); // Remove o atributo disabled do próximo campo
                digitoinput[index + 1].focus(); // Move o foco para o próximo campo
            }
        }
    });

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' && this.value.length === 0) {
            if (index > 0) {
                digitoinput[index - 1].focus(); // Move o foco para o campo anterior quando o Backspace é pressionado e o campo atual está vazio
            }
        }
    });
});