const fs = require('fs');
const express = require('express');

const app = express();

const DB_FILE = './data/przykladOdczytZapis/db.json';

app.get('/shopping_list', (req, res) => {
    fs.readFile(DB_FILE, (err, data) => {
        if (!err){
            const shoppingList = JSON.parse(data);
            res.send('Lista zakupów: ' + shoppingList.join(', '));
        } else {
            console.log('Błąd odczytu pliku', err);
            res.send('Wystąpił błąd odczytu.');
        }
    });
});

app.get('/add', (req, res) => {
    fs.readFile(DB_FILE, (err, data) => {//Odczytaj plik
        if (!err){
            //Jeżeli jest ok, to wczytaj dane z JSONa do tablicy:
            const shoppingList = JSON.parse(data);
            //Dodaj nowy element:
            shoppingList.push('Okulary przeciwsłoneczne');
            //Zamień zaktualizowaną tablicę znów na JSON:
            const jsonToWrite = JSON.stringify(shoppingList);

            fs.writeFile(DB_FILE, jsonToWrite, (err, data) => {//Zapisz plik
                if (!err) {
                    res.send('Dodano.');
                } else {
                    console.log('Błąd zapisu pliku', err);
                    res.send('Wystąpił błąd zapisu.');
                }
            });
        } else {
            console.log('Błąd odczytu pliku', err);
            res.send('Wystąpił błąd odczytu.');
        }
    });
});

app.listen(3000, () => {
    console.log('Serwer uruchomiony na porcie 3000');
});