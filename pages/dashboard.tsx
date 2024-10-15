import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaDesktop, FaUser, FaLock } from 'react-icons/fa'; // Importando ícones

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [notification, setNotification] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/user-data', {
                headers: {
                    'username': localStorage.getItem('username'),
                },
            });

            if (res.ok) {
                const data = await res.json();
                setUserData(data);
            } else {
                router.push('/login');
            }
        };

        fetchData();
    }, [router]);

    const handleLigarClick = async () => {
        if (!buttonDisabled) {
            const webhookUrl = 'https://discord.com/api/webhooks/1294002400129974302/_mb9MGycInAQkQm7w_-eG6QXslh7hylpMjPFK_Vq4FL7Irt4MPDLiInHCh-LETqTdO4h'; // Adicione o URL do seu webhook do Discord aqui
            const message = {
                content: `O usuário da máquina ${userData.machine?.ip} solicitou ligamento.`
            };

            // Enviar mensagem para o Discord via Webhook
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });

            // Mostrar notificação temporária
            setNotification('Sua máquina será ligada em até 1 hora, fique atento pois pode ser antes');
            setTimeout(() => setNotification(''), 10000); // Notificação some após 10 segundos

            // Desabilitar botão por 5 horas
            setButtonDisabled(true);
            setTimeout(() => setButtonDisabled(false), 5 * 60 * 60 * 1000); // 5 horas
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            {userData ? (
                <div className="bg-gray-800 p-10 rounded-lg shadow-2xl w-96">
                    <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">Dashboard</h1>
                    <div className="flex items-center mb-4">
                        <FaDesktop className="text-blue-500 mr-2" />
                        <p className="text-white">IP: {userData.machine ? userData.machine.ip : 'sem assinatura'}</p>
                    </div>
                    <div className="flex items-center mb-4">
                        <FaUser className="text-blue-500 mr-2" />
                        <p className="text-white">Usuário: {userData.machine ? userData.machine.username : 'sem assinatura'}</p>
                    </div>
                    <div className="flex items-center mb-6">
                        <FaLock className="text-blue-500 mr-2" />
                        <p className="text-white">Senha: {userData.machine ? userData.machine.password : 'sem assinatura'}</p>
                    </div>
                    <button
                        onClick={handleLigarClick}
                        disabled={buttonDisabled}
                        className={`w-full py-2 px-4 text-white font-bold rounded-lg 
                            ${buttonDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition duration-300'}`}
                    >
                        Ligar
                    </button>
                    {notification && (
                        <div className="mt-4 p-4 border border-blue-400 text-blue-300 bg-gray-700 rounded-lg text-center neon-border">
                            {notification}
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-white">Carregando...</p>
            )}
        </div>
    );
};

export default Dashboard;
