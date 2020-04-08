/**
 * @File Name          : EmailMetricsViewerController.cls
 * @Description        : 
 * @Author             : emmanuel.martinez@tengo.co
 * @Group              : 
 * @Last Modified By   : emmanuel.martinez@tengo.co
 * @Last Modified On   : 08/04/2020, 16:29:53
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    08/04/2020   emmanuel.martinez@tengo.co     Initial Version
**/
public class EmailMetricsViewerController {
    
    @AuraEnabled
    public static List<Account> getInitialAccountList() {
        
        List<Account> accountList = [SELECT Id, Name 
                                     FROM Account 
                                     WHERE Id IN (SELECT Account__c FROM AccountEmailMetric__c)];

                                     
        return accountList;

    }

    @AuraEnabled
    public static List<Integer> queryAccountEmailMetrics(Id accountId) {
        
        AggregateResult[] metrics1 = [SELECT SUM(TotalEmailsSent__c)totalSent, SUM(TotalOpens__c)totalOpens, SUM(Bounces__c)totalBounces 
                                      FROM AccountEmailMetric__c 
                                      WHERE Account__c = :accountId];
       

        AggregateResult aggregateResult = metrics1[0];
        Decimal totalSent = (Decimal) aggregateResult.get('totalSent');
        Decimal totalOpens = (Decimal) aggregateResult.get('totalOpens');
        Decimal totalBounces = (Decimal) aggregateResult.get('totalBounces');


        AccountEmailMetric__c metrics2 = [SELECT CampaignMembers__c, TotalUnsubscribes__c 
                                          FROM AccountEmailMetric__c 
                                          WHERE Account__c = :accountId
                                          ORDER BY CreatedDate2__c DESC
                                          LIMIT 1];  

        Decimal totalMembers = (Decimal) metrics2.CampaignMembers__c;
        Decimal totalUnsubscribes = (Decimal) metrics2.TotalUnsubscribes__c;

        List<Integer> finalMetricList = new List<Integer>();
        finalMetricList.add(totalSent.intValue());
        finalMetricList.add(totalOpens.intValue());
        finalMetricList.add(totalBounces.intValue());
        finalMetricList.add(totalMembers.intValue());
        finalMetricList.add(totalUnsubscribes.intValue());

        return finalMetricList;

    }

}
