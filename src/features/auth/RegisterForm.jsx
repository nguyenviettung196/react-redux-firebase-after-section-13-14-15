import { Form, Formik } from 'formik';
import React from 'react';
import ModalWrapper from '../../app/common/modals/ModalWrapper';
import * as Yup from 'yup';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Label } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../app/common/modals/modalReducer';
import { registerInFirebase } from '../../app/firestore/firebaseService';

export default function RegisterForm() {
  const dispatch = useDispatch();
  return (
    <ModalWrapper size={`mini`} header='Register to Re-vents'>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={Yup.object({
          displayName: Yup.string().required(),
          email: Yup.string().required().email(),
          password: Yup.string().required()
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await registerInFirebase(values);
            setSubmitting(false);
            dispatch(closeModal());
          } catch (error) {
            setErrors({ auth: error.message });
            setSubmitting(false);
            console.log(error);
          }


        }}
      >
        {({ isSubmitting, isValid, dirty, errors }) => (
          <Form className='ui form'>
            <MyTextInput label={`Name`} name='displayName' placeholder='User Name' />
            <MyTextInput label={`Email`} name='email' placeholder='Email Address' />
            <MyTextInput label={`Password`} name='password' placeholder='Password' type='password' />
            {errors.auth && <Label basic color='red' style={{ marginBottom: 10 }} content={errors.auth} />}
            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              type='submit'
              fluid
              size='large'
              color='teal'
              content='Register'
            />
          </Form>
        )}
      </Formik>
    </ModalWrapper >
  );
}

