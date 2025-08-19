import { inject, Injectable, OnInit } from '@angular/core';
import { IControl } from '@trenet2/ng-form-json-dynamic';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogComponent } from '../../shared/components/dynamic-dialog/dynamic-dialog.component';

@Injectable({
    providedIn: 'root'
})

export class DynamicDialogSerivce {

    private dialogService = inject(DialogService);

    private configDefault: DynamicDialogConfig = {
        header: '',
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        modal: true,
        maximizable: true,
        breakpoints: {
            '960px': '75vw',
            '640px': '100vw'
        }
    };

    open(data: IDataDialog, config?: DynamicDialogConfig) {
        return this.dialogService.open(DynamicDialogComponent, {
            ...this.configDefault,
            ...config,
            data: data
        });
    }

}

export interface IDataDialog {
    controls: IControl[];
    isNew: boolean;
    [key: string]: any;
}
