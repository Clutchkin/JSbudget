/*eslint-env browser*/
var budgedController = (function() {
    
    var Expense = function(id, description, value, percentage) {
        this.id = id;
        this.desctription = description;
        this.value = value;
        this.percentage = percentage;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
        this.percentage = Math.round((this.value/totalIncome)*100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
    var Income = function(id, description, value) {
        this.id = id;
        this.desctription = description;
        this.value = value;
    };
    
    var calculateTotal = function(type){
        var sum;
        sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            
            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            //Create new item based on inc or exp
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return new element
            return newItem;
        },
        
        deleteItem: function (type, id) {
            var ids, index;
            //positition of ID -1 if doestn exist
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function ()  {
            //1 calculate income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            //2 calculate the budget
            data.budget = data.totals.inc - data.totals.exp;
                        
            //3 calculate percentage
            if (data.totals.inc > 0)  {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                
            } else {
                data.percentage = -1;
            }
            
            
        },
        
        calculatePercentages: function (){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
            
        },
        
        getPercentages: function(){
            var allPercentages;
            allPercentages = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPercentages;
        },
        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }

    };
})();



//
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        itemPercentage: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(num,type) {
            var numSplit,int, dec;
            
            // +or- before number, 2 decimals, comma separating the thoussands (- 2,300.00
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            dec = numSplit[1];
            
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
                
            }

            return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int +  '.' + dec;
            
        };
    
    var nodeListForEach = function(list, callback){
                for(var i = 0; i< list.length; i++) {
                    callback(list[i], i);
                }
        };
    
    return {

        getInput: function() {   
            return {        
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                desctription: document.querySelector(DOMstrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type) {
            var html, newHTML, element;
            
            // HTML string with placeholder text
            if (type === 'inc')  {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            
            // Replace placeholder text
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.desctription);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));
            
            // Insert HTML to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
                
            
        },
        
        deleteListItem: function(selectorID){
            var el;
            
            el = document.getElementById(selectorID);
            
            el.parentNode.removeChild(el);
            
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current){
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj){
            var type;
            
            obj.budget >= 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            if(obj.percentage > 0 ){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '?';
            }
             
        },
        
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.itemPercentage);
            
            
            
            nodeListForEach(fields, function(current,index){
                
                if(percentages[index]>0){
                    current.textContent = percentages[index] + ' %';
                } else {
                    current.textContent = '?';
                }
            });
            
        },
        
        displayMonth: function() {
            var now, year, month, months;
            months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' +year;
            
        },
        
        changeType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');            
        },
                
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem;
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
        
    };
        
    var updateBudget = function(){
        //1 calulate 
        budgetCtrl.calculateBudget();
        
        //2 return
        var budget = budgetCtrl.getBudget();
        
        //3 display
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function(){
        //1 calculate
        budgetCtrl.calculatePercentages();
        //2 read 
        var percentages = budgetCtrl.getPercentages();
        //3 update interface
        
        UICtrl.displayPercentages(percentages);
        
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        //1. Get the imput data
        input = UICtrl.getInput();
        
        if(input.desctription !== '' && !isNaN(input.value) && input.value > 0){
            //2. Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.desctription, input.value)
        
            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
        
            //4. Calculate budget
            
            //5. Display the budget on the UI
            updateBudget();
            updatePercentages();
        }
        
    };
    
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1 delete item
            budgetCtrl.deleteItem(type, ID);
            
            // 2 delete item from UI
            UICtrl.deleteListItem(itemID);
            
            // 3 new budget
            updateBudget();
            updatePercentages();
            
        }
    };
    
    return {
        init: function() {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgedController,UIController);

controller.init();