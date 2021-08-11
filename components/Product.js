import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button
} from "react-native";

class Products extends Component {
    state = {
        price : 0
    }
    getPrice = () =>{
        var count = 0
        this.props.products.map((item, index) =>{
            count = count + item.price
        })
       return this.setState({
            price: count
        })
    }
    componentDidMount(){
        this.getPrice();
        
    }
   
    renderProducts = (products) => {
        console.log(products)
        return products.map((item, index) => {
            
            return (
                <View key={index} style={{ padding: 20 }}>
                    <Button onPress={() => this.props.onPress(item)} title={item.title + " - " + item.price} />
                </View>
            )
        })
    }



    render() {
        return (
            <>
            <View style={styles.container}>
                {this.renderProducts(this.props.products)}
            </View>
            <Text>{this.state.price}</Text>

            </>
        );
    }
}
export default Products;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});