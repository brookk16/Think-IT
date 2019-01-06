# Think-it: data visualization dashboard

This is a monthly sales data visualization dashboard, focusing on providing the data on each of their 10 store's: 
revenue, losses, leads and appointments. This dashboard provides the means to quickly view summary data for each/all the stores, and to compare their performaces. 


## User Experience

>Think-it is a fake company created for the purpose of showcasing interactive-front end design. It is a technology based sales company, specialising in technology solutions (i.e using technology to implement some improvement for home and businesses), that uses stores/calling to assess customer requirements (this is what is referred to as a "lead"). These "leads" are then converted to appointments, if the customer wishes to continue on with the sale and further plan their requirements. "Earnings" are considered to be the total amount of money brought into the company by an employee. Whilst "lost" is considerd to be any money that is returned to a customer, irregardless of the circumstances of that return. For example: returns through both employee fault and customer decision are both considered "lost earnings".

This dashboard is designed to be linked to a larger site, for management level staff at Think-IT to be able to quickly and effectively view sales data on all 10 stores, and compare their results. Below you can read some specific user requirements, presented for this project:

* As a store manager, it's important for me to be able to view the performace of other store, so that I can motivate my salespeople to surpass targets.
* As a regional manager, I want to be able to quickly view summary data from our stores, in a easily digestible manner, so that I can produce plans and approaches to counter any loses in profits.
* As a store manager, It would help if I could see the actual figures of how my store is doing, in a simple format, so that I can not only see which areas we may be underperforming, but also what we do well on a monthly basis.

The overall aim therefore, was to design a dashboard with readily available information that would be of most relevance to the users (i.e: store managers and above). Currently, the dashboard displays the most desired metrics used to assess sales performace, identified by the users.Such as:

Modern styling was used, with brighter colours to clearly display data, along with custom tooltips and descriptive labels to avoid any confusion.  

Please click [here](https://think-it-brookk.c9users.io/Course/think-it_wireframe.png), if you would like to see a wireframe of the orignal requirement.

## Features

### Charts


The dashboard consists of **10 charts** in total, with 3 different types:

##### Number displays: 6

_please note that all number displays will show the company totals/averages when not filtered (i.e: all the stores data), and a specific store's data, when said store is selected by the filter_

1. <a name="leads_to_appts_formula">Average amount of leads that were converted to appointments, in that month. This was calculated using the following forumla:</a>
 
   * *__(total amount of appointments / total amount of leads) x 100__*

2. <a name="earnings_formula">Average amount of earnings lost, in that month. This was calculated using the following forumla:</a>
 
   * *__(total amount lost / total amount of earned) x 100__*

3. Total amount earned per month. 

4. Total amount lost per month. 

5. Total amount of leads generated in that month.

6. Total amount of appointments generated in that month.

##### Bar charts: 2

1. Average amount earned, in each month. This average was calculated by subtracting each employee's total amount lost from their total amount earned. These values are then totaled for each store, then divided by the amount employees to give us the store average.

2. Total amount of leads and appointments generated in each month. With leads being displayed in <span style="color: #77cfc9">blue</span>, and appointments shown in <span style="color: #4F5D75">dark blue</span>


##### Pie charts: 2

1. Shows which stores are loosing less than 25% of their earnings. If a store is loosing more than 25% of their earnings, their segment with be displayed in <span style="color: #7caf1f">green</span>. If they are loosing more than 25% of their earnings, their segment will be <span style="color: #c83524">red</span>. This was calculated using the same formula explained in [bar charts no.2](#earnings_formula).

2. Shows which stores are converting more than 40% of their leads to appointments. If a store is converting more than 40% their segment will be <span style="color: #7caf1f">green</span>. If they are converting less than 40%, their segment will be <span style="color: #c83524">red</span>. This was calculated using the same formula explained in [bar charts no.1](#leads_to_appts_formula).

There is also a "Store selector" select bar, which allows users to quickly filter out all but the selected store's data. Upon clicking on the select bar, all the store's locations will be displayed (one store for each state) along with their number of employees.

Every chart bar/segment can be hovered over to see the exact figure displayed as a hover message:

* ex: Hovering over the "Texas" segment in the leads to appts conversion pie chart (pie chart 2) will display this message:
  
  _Average leads to appointments in Texas is 47%_

Some charts also have a hover over tooltip, indicated by a "**?**" symbol. Simply hover over the "**?**" the see a tooltip appear that provides more detailed information on how the value(s) were calculated.

Finally, as crossfilter.js was used in this project, you can dynamically filter data. This can be achieved by using the aforementioned select bar, or by simply clicking on the segment/bar of the data you want, to filter out all data from the other stores. You can also see multiple store's data at one time, for more precise comparison, by clicking on muliptle bars/segments. To reset the charts, re-click on the same clicked bars/segments. Or simply use the <span style="color: #52b913">"reset"</span> button, which is located at the top right of the screen.

### Other features 

At the top centre of the screen, there is a date display, which shows the current date, using javascript code within the "month.js" file. This code simply displays the current month and year. 

> Please note that this system is designed to accept a new sales-data.csv file every month. This new file would replace the previous file, displaying thst month's data. However, for the purpose of this project, only one data file is used that was generated in November. Therefore, the data will always be for November 2018, whist the data display will always show the current month and year.

The "Think-IT" logos in the header and footer, both link to the Think-IT homepage. And the other links in the footer link to each of the following pages: 

* **About**: link to the company information page 
* **Privacy**: link to the company privacy, security and GDPR regulations.
* **Contact**: link to the company contact page

Finally, the site is fully responsive and functional accross all screen sizes. With each chart reshaping to fit the current screen size, and a collapsable hamburger menu, for the link items in the footer. However, this dashboard is designed primarily to be used on desktop machines. Due to the sizes of some of the charts, and as the charts use svg elements, they do not reshpape themeselves to fit. Thus scrollbars will appear on smaller screen sizes, to compansate for their larger size. 

The project has the scope to be able to add additional charts and features, quickly and efficiently, should the users feel it is required.

## Technologies used

* Boostrap 4.1.3
  * Used Bootstrap CSS styling to provide grid system structure, and basic styling elements

* Fontawesome 5.5.0
  * Used to provide images for the: hover tooltip, logo, reset button pass and fail icons

* Google fonts 
 * Used the following fonts: [Pacifico](https://fonts.google.com/specimen/Pacifico) and [Archivo](https://fonts.google.com/specimen/Archivo+Black)
















