import { LightningElement, wire, track, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getInitialAccountList from '@salesforce/apex/EmailMetricsViewerController.getInitialAccountList';
import queryAccountEmailMetrics from '@salesforce/apex/EmailMetricsViewerController.queryAccountEmailMetrics';


export default class EmailMetricsViewerLWC extends LightningElement {

    @track accountList = [];
    @track value = '';
    @track totalEmailsSent = 0;
    @track totalOpens = 0;
    @track openRate = 0;
    @track totalBounces = 0;
    @track bounceRate = 0;
    @track totalCampaignMembers = 0;
    @track totalUnsubscribes = 0;
    @track unsubscribeRate = 0;
    @track selectedAccountId = undefined;
    @track displaySpinner = false;
    @track accountName;
    
    get accountComboboxOptions() {
        return this.accountList;
    }

    connectedCallback() {

        this.displaySpinner = true;
        
        getInitialAccountList()
            .then((data) => {

                if (data.length > 0) {
                    let comboValues = this.convertToComboboxValues(data); 
                    this.accountList = comboValues;
                }
                
                this.displaySpinner = false;

            })
            .catch(error => {

                this.displaySpinner = false;
                console.log('>>> Error in getInitialAccountList()');
                console.log(JSON.parse(JSON.stringify(error)));
                this.showToastMessage('There has been an error. Please reload this page and try again', 'error');

            })
    }

    getEmailMetricsForAccount(event) {

        this.displaySpinner = true;
        this.selectedAccountId = event.detail.value;
        this.accountName = event.detail.label;

        queryAccountEmailMetrics({accountId : this.selectedAccountId})
            .then((data) => {

                if (data.length > 0) {

                    let metricList = JSON.parse(JSON.stringify(data));

                    this.totalEmailsSent = metricList[0];
                    this.totalOpens = metricList[1];
                    this.totalBounces = metricList[2];
                    this.totalCampaignMembers = metricList[3];
                    this.totalUnsubscribes = metricList[4];

                    if(this.totalEmailsSent != 0) {
                        this.openRate = ((this.totalOpens / this.totalEmailsSent) * 100).toFixed(0);
                        this.bounceRate = ((this.totalBounces / this.totalEmailsSent) * 100).toFixed(0);
                    }else{
                        this.openRate = 0;
                        this.bounceRate = 0;
                    }

                    if(this.totalCampaignMembers != 0) {
                        this.unsubscribeRate = ((this.totalUnsubscribes / this.totalCampaignMembers) * 100).toFixed(0);
                    }else{
                        this.unsubscribeRate = 0;
                    }

                    this.displaySpinner = false;
                }

            })
            .catch(error => {

                this.displaySpinner = false;
                console.log('>>> Error in getEmailMetricsForAccount()');
                console.log(JSON.parse(JSON.stringify(error)));
                this.showToastMessage('There has been an error. Please reload this page and try again', 'error');

            })

    }

    convertToComboboxValues(data){

        let currentData = [];

            data.forEach((row) => {

                let rowData = {};

                rowData.label = row.Name;
                rowData.value = row.Id;
                
                currentData.push(rowData);
            });

        return currentData;

    }

    redirectToReport(event) {

        if(this.selectedAccountId != undefined){

            let baseUrl = 'https://amg--emdev.lightning.force.com/lightning/r/Report/00O29000000a7iAEAQ/view?fv0=';
            let finalUrl = baseUrl + this.selectedAccountId;

            let tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.setAttribute('href', finalUrl);
            tempLink.setAttribute('target', '_blank');
            tempLink.click();

        }else{

            this.showToastMessage('Please select an account to see its metrics report', 'info');

        }
        
    }

    showToastMessage(paramMessage, paramVariant){
        
        this.dispatchEvent(
            new ShowToastEvent({
                title: paramVariant,
                message: paramMessage,
                variant: paramVariant
            })
        );
    }

}