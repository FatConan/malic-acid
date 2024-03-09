import "jquery";
import _ from "underscore";
import ListeningClass from "../classes/ListeningClass.js";

export default class SortableTableView extends ListeningClass{
    constructor(){
        super();
        this.targetTableTimeouts = {};
        this.targetTables = $("table.sortable");
        this.paginationSelectorMatch = "select.pagination-manager";

        //Add page handling for selectors.
        let url = new URL(window.location.href);
        let page = url.searchParams.get("page");
        if(page){
            $(this.paginationSelectorMatch).val(page);
        }

        this.addListeners();
    }

    addListeners(){
        this.targetTables.each((i, table) => {
            this.targetTableTimeouts[i] = null;
            let filterTarget = $("#" + $(table).data("filterinput"));
            filterTarget.on("keydown", () => {
                this.listenForFilter(filterTarget, table, i);
            });
            this.sorter(table);
        });
    }

    sorter(table){
        let $table = $(table);
        const clicker = (table, $table) => {
            return (e) => {
                let el = e.target;
                let thEl = this.elementHelper.findParentTag(el, "TH");
                if(thEl && thEl.hasClass("sortable")){
                    let $el = $(thEl);
                    if(!$el.hasClass("no-sorting")){
                        let direction = "down";

                        if($el.hasClass("down")){
                            direction = "up";
                        }

                        $table.find("thead th").removeClass("up");
                        $table.find("thead th").removeClass("down");
                        $el.addClass(direction);

                        let column = -1;
                        let i = 0;
                        for(let th of $table.find("thead th")){
                            if(!$(th).hasClass("no-data")){
                                if(th === el){
                                    column = i;
                                    break;
                                }
                                i++;
                            }
                        }

                        this.sortTable($table, direction, column);
                    }
                }
            };
        };

        $table.find("thead th").on("click", clicker(table, $table));
        $table.on("change", (e) => {
            if(e.target.matches(this.paginationSelectorMatch)){
                let url = new URL(window.location.href);
                url.searchParams.set("page", $(e.target).val());
                window.location.href = url.href;
            }
        });
    }

    sortTable(table, direction, column){
        let $th = $(table.find("th")[column]);
        let sortingValues = [];
        let rows = table.find("tr");

        rows = rows.filter((i, row) => {
            let tbody = this.elementHelper.findParentTag(row, "TBODY");
            return this.elementHelper.findParentTag(row, "TABLE") === table[0] && tbody !== null;
        });

        //Loop over the rows to create a sortable list
        for(let i = 0; i < rows.length; i++){
            let thisColumn = rows[i].getElementsByTagName("TD")[column];
            let $thisColumn = $(thisColumn);

            //Check if we need to do anything different or if we can just use the td content
            if($th.hasClass("date-sortable")){
                sortingValues.push([i, $thisColumn.data("datesorting")]);
            }else if($th.hasClass("alt-text")){
                sortingValues.push([i, $thisColumn.data("alttext")]);
            }else if($th.hasClass("numeric")){
                sortingValues.push([i, parseInt(thisColumn.innerHTML.toLowerCase(), 10)]);
            }else{
                sortingValues.push([i, thisColumn ? thisColumn.innerHTML.toLowerCase() : ""]);
            }
        }

        this.elementHelper.quickSort(sortingValues, 1);

        if(direction === "down"){
            sortingValues.reverse();
        }

        let tbodyAlt = [];
        if(rows.length > 0){
            let tbody = $(rows[0].parentNode);
            for(let i = 0; i < sortingValues.length; i++){
                tbodyAlt.push($(rows[sortingValues[i][0]]).clone(true));
            }
            $(rows).remove();
            for(let i = 0; i < tbodyAlt.length; i++){
                tbody.append(tbodyAlt[i]);
            }
        }
    }

    listenForFilter(filterTarget, tableElements, index){
        if(this.targetTableTimeouts[index] !== null){
            clearTimeout(this.targetTableTimeouts[index]);
        }
        this.targetTableTimeouts[index] = setTimeout(function(){
            this.filter(tableElements, filterTarget.val());
        }.bind(this), 200);
    }

    filter(table, searchText){
        let $table = $(table);
        let tableElements = $table.find("tbody tr");
        searchText = searchText.toLowerCase();
        tableElements.removeClass("inline-data");
        this.trigger("sortableTable.filter", {text: searchText});
        _.each(tableElements, function(e){
            let $e = $(e);
            let $subEls = $e.find(".searchable");
            if(searchText){
                let found = false;
                //Allow for an alttext data attribute
                for(let el of $subEls){
                    let $el = $(el);
                    if($el.hasClass("alt-text")){
                        let test = $(el).data("alttext");
                        if(test && test.toLowerCase().indexOf(searchText) >= 0){
                            found = true;
                        }
                    }
                }
                if($subEls.text().toLowerCase().indexOf(searchText) >= 0){
                    found = true;
                }
                if(!found){
                    $e.addClass("inline-data");
                }
            }
        });
    }
}