Ext.Loader.setConfig({
    enabled: true
});
var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 3
});
var sm = Ext.create('Ext.selection.CheckboxModel');

Ext.define('desloc.view.cargosGestao.PrestacaoGestaoGO', {
    extend: 'Ext.window.Window',
    alias: 'widget.presgestgo',
    title: 'Prestação',
    height: 550,
    width: 990,
    autoScroll: true,
    id: 'janpresgestgo',
    align: 'stretch',
    modal: true,
    resizable: 'true',
    maximizable: 'true',
    align: 'center',
    autoShow: true,

    requires: [
        'Ext.selection.CheckboxModel',
        'Ext.ux.TextMaskPlugin',
        'Ext.ux.grid.column.ActionButtonColumn',
        'Ext.selection.CellModel',
        'Ext.util.ComponentDragger',
        'Ext.util.Region',
        'Ext.EventManager',
        'Ext.tab.Panel',
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.state.*',
        'Ext.form.*'
    ],

    items: [{
            xtype: 'container',
            layout: 'fit',
            height: 145,
            width: 1350,
            autoScroll: false,
            items: [{
                xtype: 'form',
                layout: 'vbox',
                defaults: {
                    padding: 2,
                    anchor: '100%',
                    margins: '3 0 0 0',
                    width: 950
                },
                items: [
                    {
                        xtype: 'combo',
                        editable: false,
                        id: 'regCombo',
                        fieldLabel: 'Regional',
                        displayField: 'regional',
                        valueField: 'numloc',
                        store: Ext.create('desloc.store.Regs'),
                        triggerAction: 'all',
                        totalProperty: 'total',
                        mode: 'local',
                        listeners: {
                            select: {
                                fn: function(combo, value) {

                                    var comboUnid = Ext.getCmp('uniCombo');
                                    comboUnid.setDisabled(true);
                                    comboUnid.setValue('');
                                    comboUnid.store.removeAll();

                                    comboUnid.store.load({
                                        params: { regId: combo.getValue() }
                                    });
                                    comboUnid.setDisabled(false);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        editable: false,
                        id: 'uniCombo',
                        fieldLabel: 'Unidade',
                        emptyText: 'Selecione a Unidade',
                        displayField: 'nomloc',
                        valueField: 'numloc',
                        store: Ext.create('desloc.store.Unids'),
                        triggerAction: 'all',
                        mode: 'local',
                        disabled: true,
                        listeners: {
                            select: {
                                fn: function(combo, value) {

                                    var comboUso = Ext.getCmp('usuCombo');
                                    comboUso.setDisabled(true);
                                    comboUso.setValue('');
                                    comboUso.store.removeAll();

                                    comboUso.store.load({
                                        params: { uniId: combo.getValue() }
                                    });
                                    comboUso.setDisabled(false);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        id: 'usuCombo',
                        fieldLabel: 'Colaborador',
                        emptyText: 'Selecione um Colaborador',
                        store: Ext.create('desloc.store.Usos'),
                        displayField: 'nomfun',
                        valueField: 'numcad',
                        triggerAction: 'all',
                        editable: false,
                        mode: 'local',
                        disabled: true,
                        lastQuery: ''
                    },
                    {
                        xtype: 'combo',
                        id: 'statusCombo',
                        fieldLabel: 'Situação',
                        emptyText: 'Selecione uma Situação',
                        store: Ext.create('desloc.store.SituacaoS'),
                        displayField: 'dessts',
                        valueField: 'numsts',
                        triggerAction: 'all',
                        mode: 'local',
                        editable: false,
                        lastQuery: ''
                    },
                    {
                        xtype: 'combo',
                        id: 'mesCombo',
                        fieldLabel: 'Referência',
                        emptyText: 'Mês',
                        store: Ext.create('desloc.store.MesS'),
                        displayField: 'name',
                        valueField: 'value',
                        triggerAction: 'all',
                        editable: false,
                        mode: 'local',
                        lastQuery: ''
                    },
                    {
                        xtype: 'combo',
                        id: 'anoCombo',
                        emptyText: 'Ano',
                        store: Ext.create('desloc.store.AnoS'),
                        displayField: 'name',
                        valueField: 'value',
                        triggerAction: 'all',
                        editable: false,
                        selectOnTab: false,
                        mode: 'local',
                        lastQuery: ''
                    },
                    {
                        xtype: 'combo',
                        editable: false,
                        id: 'gambCombo',
                        hidden: false,
                        tabIndex: -1,
                        style: {
                            margin: '136 0 0 0'
                        }
                    }
                ]
            }]
        },
        {
            xtype: 'grid',
            id: 'gridpreGestGO',
            height: 400,
            width: 1410,
            selModel: {
                selType: 'checkboxmodel',
                mode: 'MULTI'
            },
            layout: 'fit',
            store: Ext.create('desloc.store.cargosGestao.ListContrPresGO'),
            features: [{
                ftype: 'summary'
            }],
            columns: [
                {
                    xtype: 'actionbuttoncolumn',
                    id: 'actbtnpreCR',
                    menuDisabled: true,
                    width: 36,
                    items: [{
                        iconCls: 'icon-edit'
                    }],
                    listeners: {
                       click: function() {
                          var sPanelGridPre = Ext.getCmp('gridpreGestGO');
                          var selectedRecords = sPanelGridPre.getSelectionModel().getSelection();  
                          
                          vDtfim = selectedRecords[0].get("dtfim");
                          vStspr = selectedRecords[0].get("stspre");  
                          dateParm = Ext.Date.parse(vDtfim, "d/m/Y");
                          dateH = mes + '/' + dia + '/' + ano;  
                          dateHoje = new Date(dateH);

                          if (dateHoje > dateParm) {

                            Ext.Msg.alert('Mensagem', 'A data limite da prestação de contas foi ultrapassada.', function(btn, text) {});   
                          }else{
                             if(vStspr == 0){
                               if(codcargo == 7800 || codcargo == 7300) {
                                 Ext.create('desloc.view.cargosGestao.CadPresGestCR'); 
                               }

                               if(codcargo == 6500) {
                                Ext.create('desloc.view.cargosGestao.CadPresGestGO'); 
                              }

                             }else {                                   
                                 Ext.create('desloc.view.cargosGestao.CadPresGestCRNoEdit');
                             }                               
                          }
                       }
                    }
                },
                {
                    header: 'Referência',
                    dataIndex: 'mesref',
                    width: 90,
                    menuDisabled: true,
                    id: 'mesrefGO',
                    name: 'mesrefGO',
                    summaryRenderer: function() {
                        return 'Total:'
                    }
                },
                {
                    header: 'Data Limite',
                    dataIndex: 'dtfim',
                    width: 93,
                    menuDisabled: true,
                    id: 'dtfimGO',
                    name: 'dtfimGO'
                },
                {
                    header: 'Id Planejamento',
                    dataIndex: 'seqpla',
                    menuDisabled: true,
                    hidden: true
                },
                {
                    header: 'Matricula',
                    dataIndex: 'numcad',
                    width: 80,
                    menuDisabled: true,
                    hidden: false
                },
                {
                    header: 'Nome',
                    dataIndex: 'nomfun',
                    width: 258,
                    menuDisabled: true,
                    summaryType: 'count'
                },
                {
                    header: 'Cargo',
                    dataIndex: 'titred',
                    width: 180,
                    menuDisabled: true
                },
                {
                    header: 'Transporte',
                    dataIndex: 'destrp',
                    width: 90,
                    menuDisabled: true
                },
                {
                    header: 'Valor',
                    dataIndex: 'vlrpre',
                    menuDisabled: true,
                    summaryType: 'sum',
                    renderer: function(val) {
                        var metodo = Ext.util.Format.maskRenderer('R$ #9.999.990,00', true);

                        if (val.length > 1) {

                            metodo = Ext.util.Format.maskRenderer('R$ #9.999.990,00', true);
                        }

                        return metodo(val);
                    }
                },
                {
                    header: 'Situação',
                    dataIndex: 'dessts',
                    menuDisabled: true
                },
                {
                    header: 'Id Abertura',
                    dataIndex: 'numseq',
                    menuDisabled: true,
                    hidden: true
                },
                {
                    header: 'Id Transporte',
                    dataIndex: 'tiptrp',
                    menuDisabled: true,
                    hidden: true
                },
                {
                    header: 'Valor KM',
                    dataIndex: 'vlrtrp',
                    menuDisabled: true,
                    hidden: true
                },
                {
                    header: 'Id Situação',
                    dataIndex: 'stspre',
                    menuDisabled: true,
                    hidden: true
                },
                {
                    header: 'Justificativa',
                    dataIndex: 'juspre',
                    menuDisabled: true,
                    hidden: true
                },
                {
                    header: 'Local',
                    width: 310,
                    dataIndex: 'nomloc',
                    menuDisabled: true,
                    hidden: false
                }
            ],
            plugins: [cellEditing],
            listeners: {

            } //Final do listeners

        }//Fim da Primeira grid
    ],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        items: [

            {
                xtype: 'button',
                text: 'Buscar',
                tooltip: 'Localizar Prestação',
                id: 'btn_buscGO',
                iconCls: 'icon-buscar',
                handler: function() {

                    if (codcargo == 6500 || mat == 858 || mat == 13917 || mat == 16963) {
                        var pGrid = Ext.getCmp('gridpreGestGO');    
                    }else{
                        var pGrid = Ext.getCmp('gridpreGestCR');
                    }

                    var comboUso = Ext.getCmp('usuCombo');
                    var comboUnid = Ext.getCmp('uniCombo');
                    var comboReg = Ext.getCmp('regCombo');
                    var comboSts = Ext.getCmp('statusCombo');
                    var comboMes = Ext.getCmp('mesCombo').getValue();
                    var comboAno = Ext.getCmp('anoCombo').getValue();

                    var aStore = pGrid.getStore();
                    aStore.load({
                        params: {
                            mat: comboUso.getValue(),
                            unid: comboUnid.getValue(),
                            reg: comboReg.getValue(),
                            sts: comboSts.getValue(),
                            mes: comboMes,
                            ano: comboAno
                        }
                    });                   
                }
            }                        
        ]
    }],
    listeners: {
        beforeclose: function() {
            

        }
    }
});

//=================================================================================================================
//=================================================================================================================