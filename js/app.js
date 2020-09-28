// Budget Controller
var budgetController=(function(budgetCtrl, UICtrl){
    var Expense=function(id,des,val){
        this.id=id;
        this.des=des;
        this.val=val;
        this.percentage=-1;
    };
    Expense.prototype.CalcPercentage=function(TotalIncome){
        if(TotalIncome > 0){
            this.percentage = Math.round((this.val/TotalIncome)*100);
        }
       else{
           this.percentage=-1;
       } 
    };
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    };
    var Income=function(id,des,val){
        this.id=id;
        this.des=des;
        this.val=val;
    };
    var Totals=function(type){
        var sum=0;
         data.allItems[type].forEach(function(cur){
            sum += cur.val;
        });
        data.totals[type]=sum;
    
    };
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        Budget: 0,
        percentage:-1
    };
    return {
        additem:function(type,des,val){
            var newItem,ID;
            if(data.allItems[type].length>0){
                ID=data.allItems[type][data.allItems[type].length-1].id + 1;
            }
           else {
               ID=0;
           }
        if(type==='exp'){
            newItem =new Expense(ID,des,val);
        }
        else if(type==='inc'){
            newItem =new Income(ID,des,val);
        }
        data.allItems[type].push(newItem);
        return newItem;
            
        },
        deleteItem:function(type,id){
        var IDs,index;
            IDs= data.allItems[type].map(function(current){
                return current.id;
            });
            index= IDs.indexOf(id);
            
            if(index !== -1)
            {
                data.allItems[type].splice(index,1);
            }   
        },
        calculateBudget:function(){
            // calculate the total income and expenses
            Totals('exp');
            Totals('inc');
            // calculate the budget : income - expenses
            data.Budget = data.totals.inc - data.totals.exp;
             // calculate the percentage
             if(data.totals.inc > 0){
                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
             }
             else {
                 data.percentage=-1;
             }
        },
        calculatePercentages:function(){
            data.allItems.exp.forEach(function(cur){
                cur.CalcPercentage(data.totals.inc);
            });
        },
        getPercentages:function(){
            var percentages;
           percentages= data.allItems.exp.map(function(cur){
                 return cur.getPercentage();
            });
            return percentages;
        },
        getBudget:function(){
            return {
                budget:data.Budget,
                totalIncome:data.totals.inc,
                totalExpenses:data.totals.exp,
                percentage:data.percentage
            };
        },
        testing:function(){
            console.log(data);
        }   
    };
})();
// UI Controller
var UIController=(function(){
    var DOMstring ={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        BudgetLabel:'.budget__value',
        IncomeLabel:'.budget__income--value',
        ExpenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        Container:'.container',
        ExpensePercLabel:'.item__percentage',
        DateLabel:'.budget__title--month'

    }
    var ForamatNumber=function(num,type){
        num=Math.abs(num);
        num=num.toFixed(2);
        var Numsplit=num.split('.');
        var int=Numsplit[0];
        
        if(int.length>3){
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);

        }
        var dec=Numsplit[1];
        return (type==='inc'? '+':'-') +' '+int+'.'+dec;
        
    };
    var nodeListEach= function(list,callback){
        for(var i=0;i<list.length;i++)
         {         
        callback(list[i],i);
        }
  };
    return {
        displayDate:function(){
            var now,month,months,year;
            now=new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            month=now.getMonth();
            year=now.getFullYear();
            document.querySelector(DOMstring.DateLabel).textContent=months[month]+ ' '+year;
        },
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstring.inputType + ',' +
                DOMstring.inputDescription + ',' +
                DOMstring.inputValue);
            
            nodeListEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstring.inputBtn).classList.toggle('red');
            
        },
        getInput:function(){
            return{
                type:document.querySelector(DOMstring.inputType).value,
                description: document.querySelector(DOMstring.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstring.inputValue).value)

            };
        },
       addListItem:function(obj,type){
        var html,Newhtml,element;
        //create new html string with placeholder text
        if (type === 'inc') {
            element = DOMstring.incomeContainer;
            
            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMstring.expensesContainer;
            
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        
        //Replace the placeholder text with some actual data
        Newhtml=html.replace('%id%',obj.id);
        Newhtml=Newhtml.replace('%description%',obj.des);
        Newhtml=Newhtml.replace('%value%',ForamatNumber(obj.val,type));
        
        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', Newhtml);
       },
       deleteListItem:function(ItemId){
           var el =document.getElementById(ItemId);
        el.parentNode.removeChild(el);
       },
       clearFields:function(){
        var Fields,ArrayFields;
        Fields=document.querySelectorAll(DOMstring.inputDescription +','+DOMstring.inputValue);
        ArrayFields=Array.prototype.slice.call(Fields);
        ArrayFields.forEach(function(current,index,array){
            current.value="";
        });
        ArrayFields[0].focus();
       },

         BudgetDisplay:function(obj)
        {
            if(obj.budget>0){document.querySelector(DOMstring.BudgetLabel).textContent =ForamatNumber( obj.budget,'inc');
            }
            else{
                document.querySelector(DOMstring.BudgetLabel).textContent =ForamatNumber( obj.budget,'exp');
            }
        document.querySelector(DOMstring.IncomeLabel).textContent=ForamatNumber(obj.totalIncome,'inc') ;
        document.querySelector(DOMstring.ExpenseLabel).textContent=ForamatNumber(obj.totalExpenses,'exp') ;
        if(obj.percentage===-1){
            document.querySelector(DOMstring.percentageLabel).textContent='---';
            }
        else {
              document.querySelector(DOMstring.percentageLabel).textContent=obj.percentage +'%';
              } 
       },
       displayPercetages:function(percentages){
        var Fields = document.querySelectorAll(DOMstring.ExpensePercLabel);
     
        nodeListEach(Fields,function(cur,index){
            if(percentages[index]>0){
                cur.textContent=`${percentages[index]}%`;
            }
            else {
                cur.textContent='---';
            }
           
        });
       },
        getDom:function(){
            return DOMstring;
        }
    };
})();
// Global App 
var Controller=(function(budgetCtrl,UIctrl){
    
    var SetupEventListener=function(){
        var DOM= UIctrl.getDom();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
         document.addEventListener('keypress',function(event){
            if(event.keycode===13|| event.which===13){
               ctrlAddItem();
            }
        });
    document.querySelector(DOM.Container).addEventListener('click',ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changedType); 
    }
    var UpdateBudget=function(){
        var FinalBudget;
        // calculate the budget
        budgetCtrl.calculateBudget();
        // return the budget
         FinalBudget= budgetCtrl.getBudget();
        //Display te budget on the UI
        UIctrl.BudgetDisplay(FinalBudget);
    };
    var UpdatePercentages=function(){
        // calculate the percentages
        budgetCtrl.calculatePercentages();
        // read the percentages from budget controller
       var percentages= budgetCtrl.getPercentages();
        // display the percentages
        UIctrl.displayPercetages(percentages);
    };
    var ctrlAddItem=function()
    {
        var NEWItem;
// get data from input fields
var input=UIctrl.getInput();
        console.log(input);
if(input.description !=="" && !isNaN(input.value) && input.value>0){
    //add the item to the budget controller
    NEWItem = budgetCtrl.additem(input.type,input.description,input.value);
    
 //add the item to the UI 
     
     UIctrl.addListItem(NEWItem,input.type);
 // clear input fields
     UIctrl.clearFields();
 // Update the budget 
    UpdateBudget();
// Update the percentages
    UpdatePercentages();
// Display Percentages
UpdatePercentages();
}
   }
   var ctrlDeleteItem =function(event){
       var ItemID,type,ID,SplitID;
       ItemID=(event.target.parentNode.parentNode.parentNode.parentNode.id);
       if(ItemID)
       {
         SplitID = ItemID.split('-');
         type = SplitID[0];
         ID = parseInt(SplitID[1]);
       
       // delete the item from the budget controller
       budgetCtrl.deleteItem(type,ID);
       // delete the item from UI
       UIctrl.deleteListItem(ItemID);
       // Update and show the new budget
       UpdateBudget();
       // Update the percentages
       UpdatePercentages();
       
       }
   };
    return{
        init:function(){
            UIctrl.displayDate();
            UIctrl.BudgetDisplay({
                budget:0,
                totalIncome:0,
                totalExpenses:0,
                percentage:-1
            });
            SetupEventListener();
           
        }    
    }
})(budgetController, UIController);
Controller.init();


