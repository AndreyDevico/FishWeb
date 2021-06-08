import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { CloseCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@material-ui/core";
import { Modal, Row, Col } from "antd";
import { AiOutlineMinus } from "react-icons/ai";

import { product } from "../../Interfaces/Interfaces";
import {
  buyThunk,
  deleteFullItemThunk,
  getProducts,
  setIsEnd,
  setCorrectNumber,
  refresh,
  setFilterProducts,
} from "../../store/actions/actions";
import { AppState } from "../../store/reducers/rootReducer";
import Cart from "../../components/Cart";
import styles from "./styles.module.scss";

type Params = {
  productId: string;
};

const DetailProduct: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { productId } = useParams<Params>();
  const products: Array<product> = useSelector(
    (state: AppState) => state.mainReducer.products
  );
  const cart: Array<product> = useSelector(
    (state: AppState) => state.mainReducer.cart
  );
  const totalPrice: number = useSelector(
    (state: AppState) => state.mainReducer.totalPrice
  );
  const [product, setProduct] = useState<product>();
  const [size, setSize] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isCorrectPhone = useSelector(
    (state: AppState) => state.mainReducer.isCorrectPhone
  );
  const isEnd = useSelector((state: AppState) => state.mainReducer.isEnd);
  const [isFooter, setIsFooter] = useState({});
  const phoneValue = useRef<any>(null);
  const regPhone = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

  useEffect(() => {
    dispatch(setFilterProducts([]));
  }, []);

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    setProduct(product);
    if (!products.length) {
      dispatch(getProducts());
    }
  }, [products]);

  useEffect(() => {
    if (isEnd) {
      setIsFooter({ footer: null });
    } else {
      setIsFooter({});
    }
  }, [isEnd]);

  const buyHandler = (action: string) => {
    if (size) {
      dispatch(buyThunk(product?._id, action, size));
      setIsModalVisible(true);
    }
  };

  const handleProducSizeChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setSize(event.target.value as string);
  };

  const handleOk = () => {
    if (cart.length) {
      dispatch(setCorrectNumber(true));
      history.push("/order");
      dispatch(setIsEnd(true));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if (isEnd) {
      dispatch(getProducts());
      dispatch(refresh(false));
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles["image-wrapper"]}>
        {product && (
          <img
            className={styles.image}
            src={require(`../../assets/img/${product.img}`)}
          />
        )}
      </div>
      <div className={styles.content}>
        <Typography style={{ marginBottom: "5px" }} variant="h2" component="h2">
          {product?.name}
        </Typography>
        <div
          style={{ width: "100%", height: "1px", backgroundColor: "black" }}
        />
        <div className={styles.sub}>
          <Typography variant="h3" component="h3">
            {product?.price} UAH
          </Typography>
          <FormControl
            variant="filled"
            component="fieldset"
            style={{ minWidth: "200px" }}
          >
            <InputLabel>Select size</InputLabel>
            <Select
              native
              aria-label="gender"
              name="gender1"
              value={size}
              onChange={handleProducSizeChange}
            >
              <option aria-label="None" value="" />
              {product?.size?.split(",").map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>
        <div
          style={{ width: "100%", height: "1px", backgroundColor: "black" }}
        />
        <Typography style={{ marginTop: "15px" }} component="p">
          {product?.descr}
        </Typography>
        <Button
          onClick={() => buyHandler("add")}
          variant="contained"
          size="medium"
          color="primary"
          style={{ width: "300px", marginTop: "20px" }}
        >
          Buy
        </Button>
      </div>
      <Modal
        title={isCorrectPhone ? "Оформление заказа" : "Корзина"}
        width={1000}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Продолжить"
        okText="Заказать"
      >
        <Cart
          cart={cart}
          totalPrice={totalPrice}
          closeModal={() => setIsModalVisible(false)}
          onChangeProductAmount={buyHandler}
        />
      </Modal>
    </div>
  );
};

export default DetailProduct;
