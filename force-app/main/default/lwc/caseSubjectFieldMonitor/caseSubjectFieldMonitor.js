import myjquery from '@salesforce/resourceUrl/jqueryemdevzip';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { LightningElement, wire, track, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseSubjectFieldMonitor extends LightningElement {

    @track count = 0;
    paginationPluginInitialized = false;

    renderedCallback() {
        if (this.paginationPluginInitialized) {
            return;
        }
        this.paginationPluginInitialized = true;

        loadScript(this, myjquery + '/jquery.min.js')
        .then(() => {
            this.testJQuery();
        })
        .catch(error => {
            console.log('Error during jquery loading')
            console.log(error);
            console.log(JSON.parse(JSON.stringify(error)));
            throw(error);
        });
    }
    connectedCallback() {
        console.log('Hello from connectedCallback()')
    }

    testJQuery(){

        console.log('Hello from testJQuery');
        try{
            
                console.log('entered in document ready');

                let myElement = this.template.querySelector(".test-emdev");
                $(myElement).css("background-color", "green");

        }catch(err){

            console.log('An error occurred in testJQuery()')
            console.log(JSON.parse(JSON.stringify(err)));
            console.log(err);

        }
        
    }
    
    handleMouseOver(){
        alert('Mouse over detected in Subject input');
    }

}