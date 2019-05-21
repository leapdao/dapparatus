import React, { Component } from 'react'
import deepmerge from 'deepmerge';
const GASBOOSTPRICE = 0.05 //gwei

let pollInterval
let pollTime = 39007

let defaultConfig = {}
defaultConfig.DEBUG = false;
defaultConfig.hardcodedGwei = false
defaultConfig.hide = true;
defaultConfig.gasBoostPrice = GASBOOSTPRICE;

class Gas extends Component {
  constructor(props) {
    super(props);
    let config = defaultConfig
    if(props.config) {
      config = deepmerge(config, props.config)
    }
    this.state = {
      gwei: 21,
      config: config,
    }
  }
  componentDidMount(){
    pollInterval = setInterval(this.checkOnGasPrices.bind(this),pollTime)
    setTimeout(this.checkOnGasPrices.bind(this),3500)
    setTimeout(this.checkOnGasPrices.bind(this),8500)
    setTimeout(this.checkOnGasPrices.bind(this),19000)
    this.checkOnGasPrices()
  }
  componentWillUnmount(){
    clearInterval(pollInterval)
  }
  checkOnGasPrices(){
    if(this.props.network && this.props.network === 'Mainnet'){
      if(!this.state.config.hardcodedGwei){
        fetch({
          method: 'get',
          url: 'https://ethgasstation.info/json/ethgasAPI.json',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        })
        .catch((err)=>{
          console.log('Error getting gas price',err)
        })
        .then(r => r.json())
        .then((response)=>{
          if(response.average > 0 && response.average < 200){
            response.average = response.average + (response.average*GASBOOSTPRICE)
            let setMainGasTo = Math.round(response.average*100)/1000
            if(this.state.gwei !== setMainGasTo){
              let update = {gwei:setMainGasTo}
              this.setState(update)
              this.props.onUpdate(update)
            }
          }
        })
      }else{
        let update = {gwei:this.state.config.hardcodedGwei}
        this.setState(update)
        this.props.onUpdate(update)
      }
    }
  }
  render() {
    if(this.state.config.hide){
      return false
    } else {
      return (
        <div style={{padding:10}}>
          <b>Gas</b>
          <div><i>{this.state.gwei} wei</i></div>
        </div>
      );
    }
  }
}

export default Gas;
