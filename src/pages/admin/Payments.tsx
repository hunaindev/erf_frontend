import React, { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Download, Filter, DollarSign, CreditCard, TrendingUp, AlertCircle, Eye, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCSV, exportToPDF } from '../../utils/tableExport';

const paymentsData = [
  {
    id: "PAY-001",
    amount: 199,
    currency: "USD",
    status: "completed",
    method: "stripe",
    brand: "Nike",
    subscriptionType: "Premium",
    date: "2024-01-15",
    transactionId: "txn_1234567890",
    description: "Monthly premium subscription payment from Nike for platform access and premium features",
    period: "Monthly"
  },
  {
    id: "PAY-002",
    amount: 499,
    currency: "USD",
    status: "pending",
    method: "paypal",
    brand: "Adidas",
    subscriptionType: "Enterprise",
    date: "2024-01-14",
    transactionId: "txn_0987654321",
    description: "Annual enterprise subscription payment from Adidas for platform access",
    period: "Annual"
  },
  {
    id: "PAY-003",
    amount: 99,
    currency: "USD",
    status: "failed",
    method: "stripe",
    brand: "Apple",
    subscriptionType: "Basic",
    date: "2024-01-13",
    transactionId: "txn_1122334455",
    description: "Monthly basic subscription payment from Apple for platform access",
    period: "Monthly"
  },
  {
    id: "PAY-004",
    amount: 299,
    currency: "USD",
    status: "completed",
    method: "bank_transfer",
    brand: "Spotify",
    subscriptionType: "Premium",
    date: "2024-01-12",
    transactionId: "txn_5566778899",
    description: "Quarterly premium subscription payment from Spotify for platform access",
    period: "Quarterly"
  }
];

const AdminÖdemeler = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [payments, setÖdemeler] = useState(paymentsData);

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'stripe':
        return <Badge variant="outline" className="badge-stripe">Stripe</Badge>;
      case 'paypal':
        return <Badge variant="outline" className="badge-paypal">PayPal</Badge>;
      case 'bank_transfer':
        return <Badge variant="outline" className="badge-bank">Banka Havalesi</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const exportData = filteredÖdemeler.map(payment => ({
      'Payment ID': payment.id,
      'Transaction ID': payment.transactionId,
      Amount: `$${payment.amount} ${payment.currency}`,
      Method: payment.method,
      Brand: payment.brand,
      'Subscription Type': payment.subscriptionType,
      Period: payment.period,
      Date: payment.date,
      Description: payment.description
    }));

    if (format === 'csv') {
      exportToCSV(exportData, 'payments');
    } else {
      exportToPDF(exportData, 'payments', 'Marka Abonelik Odeme Raporu');
    }
    
    toast.success(`Ödemeler exported as ${format.toUpperCase()}`);
  };

  const filteredÖdemeler = payments.filter(payment => {
    const matchesSearch = payment.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.subscriptionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalÖdemeler = payments.length;
  const thisMonthRevenue = Math.floor(payments.reduce((sum, payment) => sum + payment.amount, 0) * 0.3);
  const activeSubscriptions = payments.length;

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>Marka Abonelik Ödemeleri</h1>
          <p>Tüm marka abonelik ödemelerini izleyin ve yönetin</p>
        </div>

        {/* Payment Stats */}
        <div className="stats-grid md-cols-2 lg-cols-4">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$997</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Ödeme</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.length}</div>
              <p className="text-xs text-muted-foreground">All transactions</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bu Ay</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.floor(997 * 0.3)}</div>
              <p className="text-xs text-muted-foreground">Bu ayki gelir</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Abonelikler</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.length}</div>
              <p className="text-xs text-muted-foreground">Su anda aktif</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="filters-section">
          <CardHeader>
            <CardTitle>Tüm Abonelik Ödemeleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="filters-row md-flex-row">
              <div className="search-wrapper">
                <Search className="search-icon" />
                <Input
                  placeholder="Ödemeleri, markaları ve abonelik türlerini ara..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="filter-select">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Yonteme gore filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Yöntemler</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Banka Havalesi</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="export-button">
                    <Download className="h-4 w-4 mr-2" />Disa Aktar</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileDown className="h-4 w-4 mr-2" />
                    CSV olarak disa aktar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF olarak disa aktar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Ödemeler Table */}
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ödeme ID</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Yontem</TableHead>
                    <TableHead>Marka</TableHead>
                    <TableHead>Abonelik</TableHead>
                    <TableHead>Dönem</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Islemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredÖdemeler.map((payment) => (
                    <TableRow key={payment.id} className="table-row">
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${payment.amount.toLocaleString()} {payment.currency}
                        </div>
                      </TableCell>
                      <TableCell>{getMethodBadge(payment.method)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{payment.brand}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{payment.subscriptionType}</div>
                      </TableCell>
                      <TableCell>{payment.period}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedPayment(payment)}
                          className="view-button"
                        >
                          <Eye className="h-4 w-4 mr-1" />Görüntüle</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details Dialog */}
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent className="dialog-content">
            <DialogHeader className="dialog-header">
              <DialogTitle className="dialog-title">Ödeme Detayları</DialogTitle>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ödeme ID</label>
                    <div className="mt-1 font-mono text-sm">{selectedPayment.id}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Islem ID</label>
                    <div className="mt-1 font-mono text-sm">{selectedPayment.transactionId}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tutar</label>
                    <div className="mt-1 font-medium text-lg">
                      ${selectedPayment.amount.toLocaleString()} {selectedPayment.currency}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ödeme Yöntemi</label>
                    <div className="mt-1">{getMethodBadge(selectedPayment.method)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tarih</label>
                    <div className="mt-1 font-medium">{selectedPayment.date}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marka</label>
                    <div className="mt-1 font-medium">{selectedPayment.brand}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Abonelik Turu</label>
                    <div className="mt-1 font-medium">{selectedPayment.subscriptionType}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Faturalama Dönemi</label>
                  <div className="mt-1 font-medium">{selectedPayment.period}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Açıklama</label>
                  <div className="mt-1 text-sm text-gray-700">{selectedPayment.description}</div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminÖdemeler;
