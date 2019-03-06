/*
****Least Recently Used Cache******

This is a storage mechanism that is known for high performance in both time and space

it is comprised of 2 data structures: a double linked list and hash table

the values are stored / removed into the hash table in O(1) time
everytime a value is set, the linked list moves that value to the front O(N/2) if exists or it creates a new entry

*/

var LRUCache = function (limit) {
    if (typeof limit !== 'number' || limit < 2) return null;

    this.limit = limit;
    this.size = 0;
    this.index = 0;

    this.hashTable = {}    //values will be stored as val: index on linked list
    this.linkedList = {
        head: null,
        tail: null
    }
}

//nodes for linkedList
var Node = function (index, key, value) {
    this.data = {};
    this.data[key] = value;
    this.index = index;
    this.previous = null;
    this.next = null;
}

//method to recursively lookup a node O(N/2)
LRUCache.prototype.seekNodeBothWays = function (index, curHead = this.linkedList.head, curTail = this.linkedList.tail) {
    if (curHead.index === index) return curHead;
    if (curTail.index === index) return curTail;
    return seekNodeBothWays(index, curHead.next, curTail.previous);
}

//method that sets a node to the front of the list O(1)
LRUCache.prototype.bringNodeToFront = function (node) {
    //check if it's the first node being inserted
    if (this.linkedList.head === null) {
        this.linkedList.tail = node;
    } else {
        //the first node that was inserted won't have a previous property defined
        if (node.previous !== null) {
            let previousNode = node.previous;
            previousNode.next = node.next;
        }
        //if node being moved it's on the tail, set new tail
        if (node.index === this.linkedList.tail.index) {
            this.linkedList.tail = this.linkedList.tail.previous;
        }
        //set the new head
        let previousHead = this.linkedList.head;
        node.next = previousHead;
        previousHead.previous = node;
    }
    this.linkedList.head = node;
}

//lookup node and brings it to the front O(N/2)
LRUCache.prototype.get = function (key) {
    if (!this.hashTable[key]) return null;
    let index = this.hashTable[key];
    let node = this.seekNodeBothWays(index);
    this.bringNodeToFront(node);
    return node.data;
}



//method to add a new key value pair O(1) (unless key is already in cache)
LRUCache.prototype.set = function (key, val) {
    let node;
    if (this.hashTable.hasOwnProperty(key)) {
        //if it's already in cache, bring it to front and change it's value O(N/2)
        node = this.seekNodeBothWays(this.hashTable.key);
        node.data = value;
    } else {
        //create a new node object
        this.hashTable[key] = ++this.index;
        node = new Node(this.index, key, val);

        //if limit has reached, remove node on tail and hash table key (least used)   O(1)           
        if (this.size === this.limit) {
            let keyToRemove = Object.keys(this.linkedList.tail.data)[0];
            delete this.hashTable[keyToRemove];
            this.linkedList.tail = this.linkedList.tail.previous;
        } else {
            this.size++;
        }
        //append new node to the front of the linked list O(1)
        this.bringNodeToFront(node);
    }
}


//testing
let cache = new LRUCache(4);
cache.set('dog', 100);
cache.set('cat', 10);
cache.set('frog', 30);
cache.set('last', 2);
console.log(cache.get('dog'));
cache.set('full memory', 50);
cache.set('remove least used', 40);
console.log(cache.hashTable);
console.log(cache.linkedList.head);


