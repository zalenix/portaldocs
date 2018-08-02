
## Service level agreement for deployment

As per the safe deployment mandate, all the configuration changes are treated as code changes. Consequently, they use similar deployment processes.

All changes that are checked in to the dev branch will be deployed in the following order: **Dogfood** -> **RC** -> **MPAC** -> **PROD** -> National Clouds (**BlackForest**, **FairFax**, and **Mooncake**).  The following table specifies the amount of time allowed to complete the deployment.

| Environment | Service Level Agreement |
| ----------- | ------- |
| DOGFOOD     |	5 days  |
| RC	      | 10 days |
| MPAC	      | 15 days |
| PROD	      | 20 days |
| BLACKFOREST |	1 month |
| FAIRFAX	  | 1 month | 
| MOONCAKE    |	1 month | 


## Service level agreement for expedited deployment

| Environment | Service Level Agreement |
| ----------- | ------- |
| PROD	      | 7 days  |
| BLACKFOREST | 10 days |
| FAIRFAX	  | 10 days |
| MOONCAKE    |	10 days |


## Service level agreement for hosting service

The SLA for onboarding the extension is in the following table, expressed in business days.

| Environment | SLA     |
|-------------|---------|
| DOGFOOD     | 5 days  |
| MPAC        | 7 days  |
| PROD        | 12 days |
| BLACKFOREST | 15 days |
| FAIRFAX     | 15 days |
| MOONCAKE    | 15 days |

