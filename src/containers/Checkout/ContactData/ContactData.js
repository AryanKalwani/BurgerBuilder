import React,{Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import {connect} from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import {checkValidity} from '../../../store/utility';

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementconfig: {
					type: 'text',
					placeholder: 'Your Name'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			street: {
				elementType: 'input',
				elementconfig: {
					type: 'text',
					placeholder: 'Street'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			zipcode: {
				elementType: 'input',
				elementconfig: {
					type: 'text',
					placeholder: 'ZIP Code'
				},
				value: '',
				validation: {
					required: true,
					minLength: 6,
					maxLength:6
				},
				valid: false,
				touched: false
			},
			country: {
				elementType: 'input',
				elementconfig: {
					type: 'text',
					placeholder: 'Country'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			email: {
				elementType: 'input',
				elementconfig: {
					type: 'text',
					placeholder: 'Your Email'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			deliveryMethod: {
				elementType: 'select',
				elementconfig: {
					options: [
						{value: 'fastest', displayValue: 'Fastest'},
						{value: 'cheapest', displayValue: 'Cheapest'}
					]
				},
				value: 'fastest',
				validation: {},
				valid: true
			}
		},
		formIsValid: false
	}

	orderHandler = (event) => {
		event.preventDefault();
		const formData = {};
		for (let formElementIdentifier in this.state.orderForm) {
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}
		const order = {
			ingredients: this.props.ings,
			price: this.props.price,
			orderData: formData,
			userId: this.props.userId
		}
		
		this.props.onOrderBurger(order,this.props.token);
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = {
			...this.state.orderForm
		};
		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};
		updatedFormElement.value = event.target.value;
		updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
		updatedFormElement.touched = true;
		updatedOrderForm[inputIdentifier] = updatedFormElement;
		
		let formIsValid = true;
		for (let inputIdentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
		}
		this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
	}

	render () {
		const formElementsArray = [];
		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			});
		}
		let form = (
			<form onSubmit={this.orderHandler}>
				{formElementsArray.map(formElement => (
					<Input 
						key = {formElement.id} 
						elementtype={formElement.config.elementType}
						elementconfig={formElement.config.elementconfig} 
						value={formElement.config.value} 
						invalid={!formElement.config.valid}
						shouldValidate={formElement.config.validation}
						touched={formElement.config.touched}
						changed={(event) => this.inputChangedHandler(event,formElement.id)}/>
				))}
				<Button btnType="Success" disabled={!this.state.formIsValid} clicked={this.orderHandler}> ORDER </Button>
			</form>
		);
		if (this.props.loading){
			form = <Spinner />
		}
		return (
			<div className = {classes.ContactData}>
				<h4>Enter your contact data</h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onOrderBurger: (orderData,token) => dispatch(actions.purchaseBurger(orderData,token))
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios));