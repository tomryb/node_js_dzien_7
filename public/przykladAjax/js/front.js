$(function(){
    const input = $('input');
    const btn = $('button');

    btn.on('click', () => {
        const text = input.val();

        $.ajax({
            url : '/reverse',
            data : JSON.stringify({
                text, //Pamiętasz ten skrótowy zapis (text : text)?
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            type : 'POST',
            dataType : 'json',
        }).then(ans => {
            input.val(ans.reversed);
        });
    });
});