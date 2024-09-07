function editarContato(btn) {
    var row = btn.parentNode.parentNode;
    var nome = row.cells[0].innerText;
    var email = row.cells[1].innerText;
    alert("Editar contato: " + nome + " - " + email);
}

function excluirContato(btn) {
    if (confirm("Tem certeza que deseja excluir este contato?")) {
        var row = btn.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }
}

function searchContact() {
    var nomeInput = document.getElementById("nomeInput").value.toLowerCase();
    var emailInput = document.getElementById("emailInput").value.toLowerCase();
    var table = document.getElementById("contactTable");
    var tr = table.getElementsByTagName("tr");
    var found = false;

    for (var i = 1; i < tr.length; i++) {
        var tdNome = tr[i].getElementsByTagName("td")[0];
        var tdEmail = tr[i].getElementsByTagName("td")[1];
        if (tdNome && tdEmail) {
            var nomeValue = tdNome.textContent || tdNome.innerText;
            var emailValue = tdEmail.textContent || tdEmail.innerText;
            if ((nomeInput && nomeValue.toLowerCase().indexOf(nomeInput) > -1) || 
                (emailInput && emailValue.toLowerCase().indexOf(emailInput) > -1)) {
                tr[i].style.display = "";
                found = true;
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    table.style.display = found ? "table" : "none";
    return false; // Evita o envio do formulário
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("contactTable").style.display = "none";
});