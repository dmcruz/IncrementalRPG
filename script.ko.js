function RPGViewModel()  {
	var self = this;
	
	self.town = ko.observable();
	self.mayor = ko.observable();
	
   self.wood = {
        name: "wood",
	    amount: ko.observable(0),
        increment: ko.observable(0),
        max: ko.observable(100),
        storageAmount: ko.observable(0),
        storageCostWood: ko.observable(50),
		storageCostStone: ko.observable(50)
    };
    self.stone = {
        name: "stone",
	    amount: ko.observable(0),
        increment: ko.observable(0),
        max: ko.observable(100),
        storageAmount: ko.observable(0),
        storageCostWood: ko.observable(50),
		storageCostStone: ko.observable(50)
    };
    self.food = {
        name: "food",
	    amount: ko.observable(0),
        increment: ko.observable(0),
        max: ko.observable(100),
        storageAmount: ko.observable(0),
        storageCostWood: ko.observable(50),
		storageCostStone: ko.observable(50)
    };
    self.worker = {
        name: "worker",
        amount: ko.observable(0)
	};
    self.lumberjack = {
        increment: ko.observable(1),
        amount: ko.observable(0),
        cost: ko.observable(10)
    };
    self.miner = {
        increment: ko.observable(1),
        amount: ko.observable(0),
        cost: ko.observable(10)
    };
    self.hunter = {
        increment: ko.observable(1),
        amount: ko.observable(0),
        cost: ko.observable(10)
    };
	
	// Buildings
    self.tent = {
        amount: ko.observable(0),
        residents: ko.observable(1),
        costWood: ko.observable(30)
    };
    self.house = {
        amount: ko.observable(0),
        residents: ko.observable(4),
        costWood: ko.observable(75),
        costStone: ko.observable(25)
    };
    self.hostel = {
        amount: ko.observable(0),
        residents: ko.observable(10),
        costWood: ko.observable(200),
		costStone: ko.observable(215)
    };
	
	self.maxPop = ko.observable((self.tent.residents() * self.tent.amount()) + (self.house.residents() * self.house.amount()));
	self.clickIncrement = ko.observable(1); // Consider changing this to specific materials.
	
	self.chopWood = function() {
		if (self.wood.amount() < self.wood.max()) {
			add(self.wood.amount, self.clickIncrement());
		}
		checkMax(self.wood);
	}
	self.mineStone = function() {
		if (self.stone.amount() < self.stone.max()) {
			add(self.stone.amount, self.clickIncrement());
		}
		checkMax(self.stone);
	}
	self.harvestFood = function() {
		if (self.food.amount() < self.food.max()) {
			add(self.food.amount, self.clickIncrement());
		}
		checkMax(self.food);
	}
	
	self.gatherWood = function() {
		self.wood.increment(self.lumberjack.increment() * self.lumberjack.amount());
		self.chopWood();
	}
	self.gatherStone = function() {
		self.stone.increment(self.miner.increment() * self.miner.amount());
		self.mineStone();
	}
	self.gatherFood = function() {
		self.food.increment(self.hunter.increment() * self.hunter.amount());
		self.harvestFood();
	}
	
	self.createLumberjack = function() {
		if (self.worker.amount() < self.maxPop()) {
            if (self.food.amount() >= self.lumberjack.cost()) {
                subtr(self.food.amount, self.lumberjack.cost());
                increment(self.worker.amount);
                increment(self.lumberjack.amount);
                increment(self.lumberjack.cost);
                self.gatherWood();
            } else {
                $("#info").prepend($('<p>You need more food.</p>').fadeIn('slow'));
            }
		} else {
            $("#info").prepend($('<p>You need to build more accommodation.</p>').fadeIn('slow'));
        }
	}
	self.createMiner = function() {
        if (self.worker.amount() < self.maxPop()) {
            if (self.food.amount() >= self.miner.cost()) {
                subtr(self.food.amount, self.miner.cost());
                increment(self.worker.amount);
                increment(self.miner.amount);
                increment(self.miner.cost);
                add(self.stone.increment, self.miner.amount());
            } else {
                $("#info").prepend($('<p>You need more self.food.</p>').fadeIn('slow'));
            }
        } else {
            $("#info").prepend($('<p>You need to build more accommodation.</p>').fadeIn('slow'));
        }
	}
	self.createHunter = function() {
        if (self.worker.amount() < self.maxPop()) {
            if (self.food.amount() >= self.hunter.cost()) {
                subtr(self.food.amount, self.hunter.cost());
                increment(self.worker.amount);
                increment(self.hunter.amount);
                increment(self.hunter.cost);
                add(self.food.increment, self.hunter.amount());
            } else {
                $("#info").prepend($('<p>You need more self.food.</p>').fadeIn('slow'));
            }
        } else {
            $("#info").prepend($('<p>You need to build more accommodation.</p>').fadeIn('slow'));
        }
	}
	
	self.buildTent = function() {
        if (self.wood.amount() >= self.tent.costWood()) {
            subtr(self.wood.amount, self.tent.costWood());
            increment(self.tent.amount);
            multi(self.tent.costWood, 1.2);
            add(self.maxPop, self.tent.residents());
        } else {
            $("#info").prepend($('<p>You need more wood.</p>').fadeIn('slow'));
        }
	}
	self.buildHouse = function() {
        if (self.wood.amount() >= self.house.costWood() && self.stone.amount() >= self.house.costStone()) {
            subtr(self.wood.amount, self.house.costWood());
            subtr(self.stone.amount, self.house.costStone());
            increment(self.house.amount);
            multi(self.house.costWood, 1.2);
            multi(self.house.costStone, 1.2);
            add(self.maxPop, self.house.residents());
        } else {
            $("#info").prepend($('<p>You need more building materials.</p>').fadeIn('slow'));
        }
	}
	self.researchHostel = function() {
        if (self.wood.amount() >= 400 && self.stone.amount() >= 150) {
            subtr(self.wood.amount, 400);
            subtr(self.stone.amount, 150);

            $('#researchHostel').addClass('hidden');
            $('.progress-wrap-hostel').removeClass('hidden');

            var getPercent = ($('.progress-wrap-hostel').data('progress-percent-hostel') / 100);
            var getProgressWrapWidth = $('.progress-wrap-hostel').width();
            var progressTotal = getPercent * getProgressWrapWidth;
            var animationLength = 25000;

            $('.progress-bar-hostel').stop().animate({
                    left: progressTotal
                },
                animationLength,
                function () {
                    $('#buildHostel').removeClass('hidden');
                    $('.progress-wrap-hostel').addClass('hidden');
                    $('.hostelInfo').removeClass('hidden');
                    $('.hostelResearchInfo').addClass('hidden');
                });
        } else {
            $("#info").prepend($('<p>You need more building materials.</p>').fadeIn('slow'));
        }
	}
	self.buildHostel = function() {
        if (self.wood.amount() >= self.hostel.costWood() && self.stone.amount() >= self.hostel.costStone()) {
            subtr(self.wood.amount, self.hostel.costWood);
            subtr(self.stone.amount, self.hostel.costStone);
            increment(self.hostel.amount);
            multi(self.hostel.costWood, 1.2);
            multi(self.hostel.costStone, 1.2);
            add(self.maxPop, self.hostel.residents());
        } else {
            $("#info").prepend($('<p>You need more building materials.</p>').fadeIn('slow'));
        }
	}
	
	self.buildWoodStorage = function() {
        if (self.wood.amount() >= self.wood.storageCostWood() && self.stone.amount() >= self.wood.storageCostStone()) {
            subtr(self.wood.amount, self.wood.storageCostWood());
            subtr(self.stone.amount, self.wood.storageCostStone());
            increment(self.wood.storageAmount);
            add(self.wood.max, 100);
        } else {
            $("#info").prepend($('<p>You need more building materials.</p>').fadeIn('slow'));
        }
	}
	self.buildStoneStorage = function() {
        if (self.wood.amount() >= self.stone.storageCostWood() && self.stone.amount() >= self.stone.storageCostStone()) {
            subtr(self.wood.amount, self.stone.storageCostWood());
            subtr(self.stone.amount, self.stone.storageCostStone());
            increment(self.stone.storageAmount);
            add(self.stone.max, 100);
        } else {
            $("#info").prepend($('<p>You need more building materials.</p>').fadeIn('slow'));
        }
	}
	self.buildFoodStorage = function() {
        if (self.wood.amount() >= self.food.storageCostWood() && self.stone.amount() >= self.food.storageCostStone()) {
            subtr(self.wood.amount, self.food.storageCostWood());
            subtr(self.stone.amount, self.food.storageCostStone());
            increment(self.food.storageAmount);
            add(self.food.max, 100);
        } else {
            $("#info").prepend($('<p>You need more building materials.</p>').fadeIn('slow'));
        }
	}
	
    self.upgradeTwoFingers = function () {
        if (self.wood.amount() >= 100 && self.stone.amount() >= 100 && self.food.amount() >= 100) {
            subtr(self.wood.amount, 100);
            subtr(self.stone.amount, 100);
            subtr(self.food.amount, 100);
            add(self.clickIncrement, 1);
            $('.upgradeTwoFingers').addClass('hidden');
            $('.upgradeFiveFingers').removeClass('hidden');
            $("#upgrades").prepend($('<p>Two Fingers | Two Resources Per Click</p>').fadeIn('slow'));
        } else {
            $("#info").prepend($('<p>You need more resources.</p>').fadeIn('slow'));
        }
    }
    self.upgradeFiveFingers = function () {
        if (self.wood.amount() >= 450 && self.stone.amount() >= 450 && self.food.amount() >= 120) {
            subtr(self.wood.amount, 450);
            subtr(self.stone.amount, 450);
            subtr(self.food.amount, 120);
            add(self.clickIncrement, 3);
            $('.upgradeFiveFingers').addClass('hidden');
            $("#upgrades").prepend($('<p>Five Fingers | Five Resources Per Click</p>').fadeIn('slow'));
        } else {
            $("#info").prepend($('<p>You need more resources.</p>').fadeIn('slow'));
        }
    }
    self.upgradeDoubleSleepingBags = function () {
        if (self.wood.amount() >= 100 && self.stone.amount() >= 100 && self.food.amount() >= 100) {
            subtr(self.wood.amount, 100);
            subtr(self.stone.amount, 100);
            subtr(self.food.amount, 100);
            self.tent.residents(2);
            add(self.maxPop, self.tent.amount()); //This only works because we are adding ONE resident.
            $('.upgradeDoubleSleepingBags').addClass('hidden');
            $("#upgrades").prepend($('<p>Double Sleeping Bags | Two People, One Tent</p>').fadeIn('slow'));
        } else {
            $("#info").prepend($('<p>You need more resources.</p>').fadeIn('slow'));
        }
    }
    self.upgradeBunkBeds = function () {
        if (self.wood.amount() >= 100 && self.stone.amount() >= 100 && self.food.amount() >= 100) {
            subtr(self.wood.amount, 100);
            subtr(self.stone.amount, 100);
            subtr(self.food.amount, 100);
            self.house.residents(5);
            add(self.maxPop, self.house.amount()); //This only works because we are adding ONE resident.
            $('.upgradeBunkBeds').addClass('hidden');
            $("#upgrades").prepend($('<p>Bunk Beds | Five People, One House</p>').fadeIn('slow'));
        } else {
            $("#info").prepend($('<p>You need more resources.</p>').fadeIn('slow'));
        }
    }
    self.upgradeSharpenAxes = function () {
        if (self.wood.amount() >= 50 && self.stone.amount() >= 100 && self.food.amount() >= 50) {
            subtr(self.wood.amount, 50);
            subtr(self.stone.amount, 100);
            subtr(self.food.amount, 50);
            self.lumberjack.increment(2);
            self.wood.increment(self.lumberjack.increment() * self.lumberjack.amount());
            $('.upgradeSharpenAxes').addClass('hidden');
            $("#upgrades").prepend($('<p>Sharpen Axes | Lumberjacks Chop Two Wood Each</p>').fadeIn('slow'));
        } else {
            $("#info").prepend($('<p>You need more resources.</p>').fadeIn('slow'));
        }
    }
    self.upgradeSharpenPicks = function () {
        if (self.wood.amount() >= 50 && self.stone.amount() >= 100 && self.food.amount() >= 50) {
            subtr(self.wood.amount, 50);
            subtr(self.stone.amount, 100);
            subtr(self.food.amount, 50);
            self.miner.increment(2);
            self.stone.increment(self.miner.increment() * self.miner.amount());
            $('.upgradeSharpenPicks').addClass('hidden');
            $("#upgrades").prepend($('<p>Sharpen Picks | Miners Mine Two Stone Each</p>').fadeIn('slow'));
        } else {
            $("#info").prepend($('<p>You need more resources.</p>').fadeIn('slow'));
        }
    }
    self.upgradeSharpenArrows = function () {
        if (self.wood.amount() >= 50 && self.stone.amount() >= 100 && self.food.amount() >= 50) {
            subtr(self.wood.amount, 50);
            subtr(self.stone.amount, 100);
            subtr(self.food.amount, 50);
            self.hunter.increment(2);
            self.food.increment(self.hunter.increment() * self.hunter.amount());
            $('.upgradeSharpenArrows').addClass('hidden');
            $("#upgrades").prepend($('<p>Sharpen Arrows | Hunters Gather Two Food Each</p>').fadeIn('slow'));
        } else {
            $("#info").prepend($('<p>You need more resources.</p>').fadeIn('slow'));
        }
    }
    self.upgradeMatesRatesWood = function () {
        if (self.stone.amount() >= 150 && self.food.amount() >= 50) {
            subtr(self.stone.amount, 150);
            subtr(self.food.amount, 50);
            subtr(self.house.costWood, 20);
            subtr(self.tent.costWood, 15);
            $('.upgradeMatesRatesWood').addClass('hidden');
            $("#upgrades").prepend($('<p>Mates Rates - Wood | Houses and Tents Cost Less Wood</p>').fadeIn('slow'));
        } else {
            $("#info").prepend($('<p>You need more resources.</p>').fadeIn('slow'));
        }
    }
    self.upgradeMatesRatesStone = function () {
        if (self.wood.amount() >= 150 && self.food.amount() >= 50) {
            subtr(self.wood.amount, 150);
            subtr(self.food.amount, 50);
            subtr(self.house.costStone, 20);
            $('.upgradeMatesRatesStone').addClass('hidden');
            $("#upgrades").prepend($('<p>Mates Rates - Stone | Houses Cost Less Stone</p>').fadeIn('slow'));
        } else {
            $("#info").prepend($('<p>You need more resources.</p>').fadeIn('slow'));
        }
    }
	// helper functions
	function increment(observable) {
	    observable(observable() + 1);
	};
	function multi(observable, factor) {
		observable((observable() * factor).toFixed(0));
	}
	function subtr(observable, subtrahend) {
		observable(observable() - subtrahend)
	}
	function add(observable, addend) {
		observable(observable() + addend)
	}
    function checkMax(material) {
        if (material.amount() > material.max()) {
            material.amount(material.max());
        }
    }
}

$(document).ready(function() {
	var rpgGame = new RPGViewModel();
	ko.applyBindings(rpgGame);
	
    $('#onLoadModal').modal();
    beginTick();
	
    function beginTick() {
        nIntervId = setInterval(tick, 5000);
    }

    function tick() {
        rpgGame.gatherWood();
		rpgGame.gatherStone();
		rpgGame.gatherFood();
    }
});

