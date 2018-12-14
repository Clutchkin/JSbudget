//
var budgedController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.desctription = description;
        this.value = value;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.desctription = description;
        this.value = value;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //Create new ID
            if (data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0
            }
            
            //Create new item based on inc or exp
            if (type === 'exp') {
                newItem = new Expense(ID,des,val);
            } else if (type === 'inc') {
                newItem = new Income(ID,des,val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return new element
            return newItem;
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
        expensesContainer: '.expenses__list'
    };
    
    return {

        getInput: function() {   
            return {        
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                desctription: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        
        addListItem: function(obj, type) {
            var html, newHTML, element;
            
            // HTML string with placeholder text
            if (type === 'inc')  {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace placeholder text
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.desctription);
            newHTML = newHTML.replace('%value%', obj.value);
            
            // Insert HTML to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
                
            
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();



//
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem;
            }
        });
        
    };
        
    
    var ctrlAddItem = function() {
        var input, newItem;
        //1. Get the imput data
        input = UICtrl.getInput();

        //2. Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.desctription, input.value)
        
        //3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        //4. Calculate budget
        
        //5. Display the budget on the UI
        
    };
    
    return {
        init: function() {
            setupEventListeners();
        }
    };

})(budgedController,UIController);

controller.init();
