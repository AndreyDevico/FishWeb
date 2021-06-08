import axios from 'axios';
import React, { memo } from 'react'
import { useSelector } from 'react-redux';
import { product } from '../../Interfaces/Interfaces';
import { AppState } from '../../store/reducers/rootReducer';
import { saveAs } from 'file-saver'
import styles from "./styles.module.scss";

const OrderSuccessPage = () => {
    const cart: Array<product> = useSelector(
        (state: AppState) => state.mainReducer.cart
    );
    const totalPrice: number = useSelector(
        (state: AppState) => state.mainReducer.totalPrice
    );
    const orderId: string = useSelector(
        (state: AppState) => state.mainReducer.orderId
    );
    const createAndDownloadPdf = () => {
        axios.post('http://localhost:5000/api/create-pdf', { orderId })
          .then(() => axios.get('http://localhost:5000/api/fetch-pdf', { responseType: 'blob' }))
          .then((res) => {
            const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
    
            saveAs(pdfBlob, 'newPdf.pdf');
          })
      }

    return (
        <div className={styles.root}>
            <h1>Дякую за замовлення</h1>
            <p>Наш менеджер скоро зв'яжеться з вами</p>

            <button className={styles.btn} onClick={createAndDownloadPdf}>
                Скачати квитанцію
            </button>
        </div>
    )
}

export default memo(OrderSuccessPage)