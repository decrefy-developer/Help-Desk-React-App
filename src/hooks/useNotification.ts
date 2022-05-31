import { useState } from "react";

const useNotification = () => {
    const [isGranted, setIsGranted] = useState(false)

    function notify(ticketNumber: string, path: string) {
        const sounds = new Audio("audio_notif.mp3");
        sounds.play();

        const notification = new Notification("MIS Dotech", {
            body: `you have a new ticket: #${ticketNumber} `,
            icon: 'logo192.png',
        })

        // setTimeout(() => {
        //     notification.close();
        // }, 10 * 1000);

        notification.addEventListener('click', () => {
            window.open(`http://localhost:3000/${path}`);
        });

        return notification
    }

    // const showError = () => {
    //     const error: any = document.querySelector('.error');
    //     error.style.display = 'block';
    //     error.textContent = 'You blocked the notifications';
    // }

    async function requestPermission() {
        if (Notification.permission === 'granted') {
        } else if (Notification.permission !== 'denied') {
            let permission = await Notification.requestPermission();
            permission === 'granted' ? setIsGranted(true) : setIsGranted(false);
        }
    }


    return { notify, requestPermission, isGranted }
}

export default useNotification