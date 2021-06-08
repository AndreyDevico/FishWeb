import React, { memo } from "react";
import { Formik, Field, FieldProps } from "formik";
import { useDispatch } from "react-redux";
import { Button, TextField } from "@material-ui/core";

import { orderInitialValue } from "./constants";
import { OrderInitialValue } from "./types";
import styles from "./styles.module.scss";
import { createOrder } from "../../store/actions/actions";
import Summary from "../../components/Summary";
import { useHistory } from "react-router-dom";

const OrderPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = async(value: OrderInitialValue) => {
    console.log("🚀 ~ file: index.tsx ~ line 15 ~ onSubmit ~ value", value);
    if (!value) {
      return;
    }

    await dispatch(createOrder(value));
    history.push('/order-success')
  };
  return (
    <div className={styles.root}>
      <h1>Create Order</h1>
      <div className={styles.content}>
        <Formik
          initialValues={orderInitialValue}
          onSubmit={onSubmit}
          render={({ handleSubmit, values, setFieldValue }) => (
            <form onSubmit={handleSubmit} className={styles["from-wrapper"]}>
              <Field
                name="name"
                render={({ field }: FieldProps) => (
                  <TextField
                    required
                    type="text"
                    id="standard-required"
                    label="Name"
                    value={values.name}
                    onChange={(e: any) => {
                      setFieldValue(field.name, e.target.value);
                    }}
                    className={styles.input}
                  />
                )}
              />

              <Field
                name="lastName"
                render={({ field }: FieldProps) => (
                  <TextField
                    required
                    type="text"
                    id="standard-required"
                    label="Last Name"
                    value={values.lastName}
                    onChange={(e: any) => {
                      setFieldValue(field.name, e.target.value);
                    }}
                    className={styles.input}
                  />
                )}
              />
              <Field
                name="email"
                render={({ field }: FieldProps) => (
                  <TextField
                    required
                    type="email"
                    id="standard-required"
                    label="Email"
                    value={values.email}
                    onChange={(e: any) => {
                      setFieldValue(field.name, e.target.value);
                    }}
                    className={styles.input}
                  />
                )}
              />
              <Field
                name="phone"
                render={({ field }: FieldProps) => (
                  <TextField
                    required
                    type="text"
                    id="standard-required"
                    label="Phone"
                    value={values.phone}
                    onChange={(e: any) => {
                      setFieldValue(field.name, e.target.value);
                    }}
                    className={styles.input}
                  />
                )}
              />
              <Field
                name="address"
                render={({ field }: FieldProps) => (
                  <TextField
                    required
                    type="text"
                    id="standard-required"
                    label="Address Line"
                    value={values.address}
                    onChange={(e: any) => {
                      setFieldValue(field.name, e.target.value);
                    }}
                    className={styles.input}
                  />
                )}
              />
              <button type="submit">
                {/* <Button
                variant="contained"
                size="medium"
                color="primary"
                className={styles.button}
              >
                Make Order
              </Button> */}
                Make Order
              </button>
            </form>
          )}
        />
        <Summary />
      </div>
    </div>
  );
};

export default memo(OrderPage);
