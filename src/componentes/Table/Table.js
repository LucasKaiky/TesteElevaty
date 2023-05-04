import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import './style.css';

const Table = () => {
  const [people, setPeople] = useState([]);
  const [birthdateStart, setBirthdateStart] = useState('');
  const [birthdateEnd, setBirthdateEnd] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (birthdateStart && birthdateEnd) {
      fetch('https://fakerapi.it/api/v1/persons?_quantity=1000')
        .then(response => response.json())
        .then(data => {
          const filteredPeople = data.data.filter(person => {
            const birthdate = new Date(person.birthday).getTime()
            return birthdate >= new Date(birthdateStart).getTime() && birthdate <= new Date(birthdateEnd).getTime()
          });
          setPeople(filteredPeople)
        });
    };
  }, [birthdateStart, birthdateEnd]);

  const handleNameClick = (id) => {
    const person = people.find(p => p.id === id);
    setSelectedPerson(person);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  const handleDeleteClick = (id) => {
    const newPeople = people.filter(person => person.id !== id);
    setPeople(newPeople);
    setSelectedPerson(null);
  };
  return (
    <div className='container'>
      <form onSubmit={handleFormSubmit}>
        <label>
          Data de Nascimento Inicial:
        </label>
        <input type="date" value={birthdateStart} onChange={e => setBirthdateStart(e.target.value)} />
        <label>
          Data de Nascimento Final:
        </label>
        <input type="date" value={birthdateEnd} onChange={e => setBirthdateEnd(e.target.value)} />
        <button className='button' type="submit">Buscar Pessoas</button>
      </form>
      <ul>
        {people.map(person => (
          <li key={person.id}>
            {person.firstname} {person.lastname}
            <button className='botao' onClick={() => handleNameClick(person.id)}>Mostrar</button>
            <button className='botao' onClick={() => handleDeleteClick(person.id)}>Deletar</button>
          </li>
        ))}
      </ul>
      {selectedPerson && (
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Data de Nascimento</th>
                <th>Endereço</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{selectedPerson.id}</td>
            <td>{selectedPerson.firstname}</td>
            <td>{selectedPerson.email}</td>
            <td>{selectedPerson.phone}</td>
            <td>{selectedPerson.birthday}</td>
            <td>{selectedPerson.address.city}, {selectedPerson.address.country}</td>
          </tr>
        </tbody>
      </table>
      <button className='button' onClick={() => {
        fetch('https://fakerapi.it/api/v1/credit_cards')
          .then(response => response.json())
          .then(data => {
            const randomCard = data.data[Math.floor(Math.random() * data.data.length)]
            const pdf = new jsPDF()
            pdf.text(`Nome: ${selectedPerson.firstname} ${selectedPerson.lastname}`, 10, 10)
            pdf.text(`Número do cartão: ${randomCard.number}`, 10, 20)
            pdf.text(`Tipo do cartão: ${randomCard.type}`, 10, 30)
            pdf.text(`Data de vencimento: ${randomCard.expiration}`, 10, 40)
            setCards(prevCards => [...prevCards, randomCard])
            window.open(pdf.output('bloburl'), '_blank')
          });
        }}>Mostrar PDF</button>
        <h3>Cartões gerados:</h3>
        <ul>
          {cards.map((card, index) => (
            <li key={index}>{card.number}</li>
          ))}
        </ul>
      </div>
  )}
</div>
)
};

export default Table;