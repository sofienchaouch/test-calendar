import {
  Component,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
// @ts-ignore
import {  SohoModalDialogService, SohoModalDialogRef, SohoCalendarComponent, SohoToastService } from 'ids-enterprise-ng';



@Component({
  selector: 'app-month',
  templateUrl: 'month.component.html',

})
export class MonthComponent   {

  @HostBinding('style.overflow') overflow = 'auto';
  @HostBinding('style.height') height = 'auto';
  @HostBinding('style.display') block = 'block';
  @Output() startDateToCalendary = new EventEmitter<any>();

  @ViewChild(SohoCalendarComponent) sohoCalendarComponent?: SohoCalendarComponent;

  public initialMonth = 10;
  public holiday = 'holiday';
  public initialYear = 2022;
  public showViewChanger = true;
  public eventTypes: any[]=[];
  public events: any[]=[];
  public dayofweeks=5;
  public iconTooltip = 'status';
  public eventTooltip = 'comments';
  public EncourEvent: any;

  public legendEventtypes   = {
    id: 'admin',
    label: 'Team Event',
    translationKey: 'AdministrativeLeave',
    color: 'emerald',
    checked: true,
  };

  public closeResult = '(N/A)';
  public title = 'DayLegend';

  constructor(private modalService: SohoModalDialogService, private toastService: SohoToastService) {
    this.eventTypes.push(this.legendEventtypes);
   }
    public onCalendarDateSelectedCallback = (_node: Node, args: SohoCalendarDateSelectedEvent) => {
    console.log('onCalendarEventSelectedCallback', args);
  };

  public onRenderMonthCallback = (_node: Node, response: Function) => {

    response(this.events,null);

  };

  onSelected(event: SohoCalendarDateSelectedEvent) {
   this.EncourEvent=event;
  }
  dblclick() {
    console.log(EventTarget);
     this.openMessage(this.EncourEvent);
  }
  openMessage(_event: any) {
    const dialogRef = this.modalService
      .message('<span class="message">Add New Day Legend</span>')
      .buttons(
        [
          {
            text: 'Cancel', click: () => {
              dialogRef.close('CANCEL');
            }
          },
          {
            text: 'Submit', click: () => {
              let idSubmit = 0;
              if(this.events.length > 0){
                idSubmit=this.events[this.events.length-1].id+1;
              }
              console.log("idSubmit : "+idSubmit);

              const  legendEvent = {
                "id": idSubmit,
                "subject": '',
                "comments": '',
                "starts": '',
                "ends": '',
                "type": 'tdo',
                "status": 'Approved',
                "isAllDay": 'true',
                "color": '#ABEBC6'
              };
              const dateSelect=new Date(_event.year,_event.month,_event.day);
              legendEvent.starts=this.FormatDate(dateSelect,1);
              legendEvent.ends=this.FormatDate(dateSelect,2);
              this.events.push(legendEvent)   ;
              this.startDateToCalendary.emit(legendEvent.starts);

              console.log("this.events : "+JSON.stringify(this.events));
              dialogRef.close('SUBMIT');
            },
             isDefault: true
          }
        ])
      .title(this.title)
      .open()
      .afterClose((result: any) => {
        this.closeResult = result;


      });
  }
  onEventClicked(event: SohoCalendarEventClickEvent) {
    this.toastService.show({ title: 'Calendar Test', message: 'Event "' + event?.event?.subject + '" Clicked' });
    console.log('onEventClick', event);
  }

  onEventDblClicked(event: SohoCalendarEventClickEvent) {
    //this.toastService.show({ title: 'Calendar Test', message: 'Event "' + event?.event?.subject + '" Double Clicked' });
    console.log('onEventDblClick', event);
  }

  onCalendarEventContextMenu(event: SohoCalendarEventClickEvent) {
    if (event) {
      this.toastService.show({ title: 'Calendar Test', message: 'Event "' + event?.event?.subject + '" ContextMenu' });
      console.log('onEventContextMenu', event);
    }
  }
  addItem(newItem: any) {
    this.events=newItem;
  }
  FormatDate(date: Date, HowDate: number) {
    const day = date.getDate();
    const monthIndex = (date.getMonth()+1);
    const year = date.getFullYear();
    let dayString='';
    let monthIndexString='';
    if (day < 10)
      {dayString = '-0' + day.toString();}
      else
      {dayString='-'+day.toString();}

    if (monthIndex <10)
      {monthIndexString = '-0' + monthIndex;}
    else
      {monthIndexString='-'+monthIndex.toString();}

    if (HowDate == 2) {
      return year +monthIndexString+  dayString + 'T23:59:59.999';
    }
    return year +  monthIndexString +  dayString + 'T00:00:00.000';
  }
}
