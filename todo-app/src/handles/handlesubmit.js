import { addDoc, collection } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

const handleSubmit = (todo) => {
    const ref = collection(firestore, 'todo_app');

    let data = {
        todos: todo,
    };

    try {
        addDoc(ref, data);
    } catch (err) {
        console.log(err);
    }
};

export default handleSubmit;
