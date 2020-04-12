import React, {useEffect, useState} from 'react';
import './style.css';
import { Link, useHistory} from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';

export default function Profile(){

    const history = useHistory();
    const [incidents, setIncidents] = useState([]);
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(()=>{
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

    async function handleDeleteIncident(id){
        try{
            await api.delete(`casos/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            });
            setIncidents(incidents.filter(incident => incident.id !== id));
        }catch{
            alert('Erro ao deletar caso, tente novamente.');
        }   
    }

    function handleLogout(){
        localStorage.clear();
        history.push('/');
    } 
    return(
        <div className="profile-container">
            <header>
                <img src="" alt="logo"/>
                <span>Bem Vinda, {ongName}</span>
                <Link to="/casos/novo" className="button">
                    Cadastrar novos casos
                </Link>
                <button onClick={handleLogout}type="button">
                    <FiPower size={18} color="#e02041" />
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p> 
    
                        <strong>DESCRIÇÃO:</strong> 
                        <p>{incident.description}</p>
    
                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                            .format(incident.value)}</p>
    
                        <button onClick={() => handleDeleteIncident(incident.id)} type="button"> 
                            <FiTrash2 size={20} color="#a8a8b3"/> 
                        </button>  
                    </li>  
                ))}
            </ul>    
        </div>      
    )
}