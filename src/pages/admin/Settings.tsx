
import React, { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, CreditCard, Users, Shield, Bell, Mail, Globe, DollarSign, Plus } from 'lucide-react';

const AdminSettings = () => {
  const [notifications, setBildirimler] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushBildirimler: true,
    weeklyReports: true
  });

  const [paymentProviders, setPaymentProviders] = useState([
    { name: 'Stripe', status: 'connected', apiKey: 'sk_live_***' },
    { name: 'PayPal', status: 'connected', apiKey: 'sb-***' },
    { name: 'Bank Transfer', status: 'inactive', apiKey: null }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yönetici Ayarları</h1>
          <p className="text-gray-600 mt-2">Platform ayarlarını ve konfigürasyonlarını yönetin</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Genel
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Ödemeler
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Kullanıcılar
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Güvenlik
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Bildirimler
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Entegrasyonlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform-name">Platform Adı</Label>
                      <Input id="platform-name" defaultValue="InfluencerConnect" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform-url">Platform URL</Label>
                      <Input id="platform-url" defaultValue="https://influencerconnect.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform-description">Platform Açıklaması</Label>
                    <Textarea
                      id="platform-description"
                      defaultValue="Connect brands with authentic influencers for meaningful partnerships"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="support-email">Destek E-postası</Label>
                      <Input id="support-email" defaultValue="support@influencerconnect.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Yönetici E-postası</Label>
                      <Input id="admin-email" defaultValue="admin@influencerconnect.com" />
                    </div>
                  </div>

                  <Button>Değişiklikleri Kaydet</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>İş Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="commission-rate">Platform Komisyonu (%)</Label>
                      <Input id="commission-rate" type="number" defaultValue="15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Varsayılan Para Birimi</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD - Amerikan Doları</SelectItem>
                          <SelectItem value="eur">EUR - Euro</SelectItem>
                          <SelectItem value="gbp">GBP - Britanya Sterlini</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-approve">Yeni kayıtları otomatik onayla</Label>
                      <p className="text-sm text-gray-600">Yeni marka ve influencer hesaplarını otomatik onayla</p>
                    </div>
                    <Switch id="auto-approve" />
                  </div>

                  <Button>Değişiklikleri Kaydet</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Ödeme Sağlayıcıları
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Sağlayıcı Ekle
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ödeme Sağlayıcısı Ekle</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="provider-name">Sağlayıcı Adı</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Sağlayıcı seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="stripe">Stripe</SelectItem>
                                <SelectItem value="paypal">PayPal</SelectItem>
                                <SelectItem value="square">Square</SelectItem>
                                <SelectItem value="razorpay">Razorpay</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="api-key">API Anahtarı</Label>
                            <Input id="api-key" type="password" placeholder="API anahtarını girin" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="webhook-url">Webhook URL</Label>
                            <Input id="webhook-url" placeholder="https://your-webhook-url.com" />
                          </div>
                          <Button className="w-full">Sağlayıcıyı Bağla</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentProviders.map((provider, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-6 w-6" />
                          <div>
                            <h4 className="font-medium">{provider.name}</h4>
                            <p className="text-sm text-gray-600">{provider.apiKey || 'Yapılandırılmadı'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={provider.status === 'connected' ? 'default' : 'secondary'}>
                            {provider.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            {provider.status === 'connected' ? 'Yapılandır' : 'Bağlan'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ödeme Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-payout">Minimum Ödeme Tutarı</Label>
                      <Input id="min-payout" type="number" defaultValue="50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payout-schedule">Ödeme Takvimi</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Günlük</SelectItem>
                          <SelectItem value="weekly">Haftalık</SelectItem>
                          <SelectItem value="monthly">Aylık</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-payout">Otomatik Ödemeler</Label>
                      <p className="text-sm text-gray-600">Eşik değer sağlandığında ödemeleri otomatik işle</p>
                    </div>
                    <Switch id="auto-payout" />
                  </div>

                  <Button>Değişiklikleri Kaydet</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kullanıcı Yönetim Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-verification">E-posta Doğrulamasını Zorunlu Kıl</Label>
                        <p className="text-sm text-gray-600">Kullanıcılar hesap aktivasyonu öncesi e-posta doğrulamalı</p>
                      </div>
                      <Switch id="email-verification" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="manual-approval">Manuel Hesap Onayı</Label>
                        <p className="text-sm text-gray-600">Yeni hesaplar yönetici onayından geçmeli</p>
                      </div>
                      <Switch id="manual-approval" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="kyc-verification">KYC Doğrulaması Gerekli</Label>
                        <p className="text-sm text-gray-600">Ödeme işlemleri için kimlik doğrulaması iste</p>
                      </div>
                      <Switch id="kyc-verification" defaultChecked />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="free-trial-days">Ücretsiz Deneme Süresi (gün)</Label>
                      <Input id="free-trial-days" type="number" defaultValue="14" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inactive-period">Hesap Pasifleştirme Süresi (gün)</Label>
                      <Input id="inactive-period" type="number" defaultValue="90" />
                    </div>
                  </div>

                  <Button>Değişiklikleri Kaydet</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hesap Seviye Yönetimi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Temel Seviye</h4>
                        <Badge variant="outline">Ücretsiz</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Yeni kullanıcılar için sınırlı özellikler</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="basic-campaigns">Maksimum Kampanya</Label>
                          <Input id="basic-campaigns" type="number" defaultValue="2" />
                        </div>
                        <div>
                          <Label htmlFor="basic-influencers">Kampanya Başına Maksimum Influencer</Label>
                          <Input id="basic-influencers" type="number" defaultValue="5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Premium Seviye</h4>
                        <Badge>$29/month</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Büyüyen işletmeler için gelişmiş özellikler</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="premium-campaigns">Maksimum Kampanya</Label>
                          <Input id="premium-campaigns" type="number" defaultValue="10" />
                        </div>
                        <div>
                          <Label htmlFor="premium-influencers">Kampanya Başına Maksimum Influencer</Label>
                          <Input id="premium-influencers" type="number" defaultValue="25" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button>Seviye Ayarlarını Güncelle</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Güvenlik Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor">İki Aşamalı Doğrulama</Label>
                        <p className="text-sm text-gray-600">Yönetici hesapları için 2FA zorunlu olsun</p>
                      </div>
                      <Switch id="two-factor" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="session-timeout">Otomatik Oturum Zaman Aşımı</Label>
                        <p className="text-sm text-gray-600">Pasif kullanıcıları otomatik çıkış yaptır</p>
                      </div>
                      <Switch id="session-timeout" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="ip-whitelist">IP Adresi Beyaz Listeleme</Label>
                        <p className="text-sm text-gray-600">Yönetici erişimini belirli IP adresleriyle sınırla</p>
                      </div>
                      <Switch id="ip-whitelist" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-duration">Oturum Süresi (saat)</Label>
                      <Input id="session-duration" type="number" defaultValue="8" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">Şifre Geçerlilik Süresi (gün)</Label>
                      <Input id="password-expiry" type="number" defaultValue="90" />
                    </div>
                  </div>

                  <Button>Güvenlik Ayarlarıni Kaydet</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bildirim Tercihleri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-alerts">E-posta Uyarıları</Label>
                        <p className="text-sm text-gray-600">Önemli platform uyarılarını e-posta ile al</p>
                      </div>
                      <Switch
                        id="email-alerts"
                        checked={notifications.emailAlerts}
                        onCheckedChange={(checked) => setBildirimler(prev => ({ ...prev, emailAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-alerts">SMS Uyarıları</Label>
                        <p className="text-sm text-gray-600">Kritik uyarıları SMS ile al</p>
                      </div>
                      <Switch
                        id="sms-alerts"
                        checked={notifications.smsAlerts}
                        onCheckedChange={(checked) => setBildirimler(prev => ({ ...prev, smsAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Anlık Bildirimler</Label>
                        <p className="text-sm text-gray-600">Gerçek zamanlı güncellemeler için tarayıcı bildirimleri</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.pushBildirimler}
                        onCheckedChange={(checked) => setBildirimler(prev => ({ ...prev, pushBildirimler: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-reports">Haftalık Raporlar</Label>
                        <p className="text-sm text-gray-600">Haftalık platform performans raporlarini al</p>
                      </div>
                      <Switch
                        id="weekly-reports"
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => setBildirimler(prev => ({ ...prev, weeklyReports: checked }))}
                      />
                    </div>
                  </div>

                  <Button>Bildirim Ayarlarını Kaydet</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Üçüncü Taraf Entegrasyonları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-6 w-6" />
                        <div>
                          <h4 className="font-medium">E-posta Servisi</h4>
                          <p className="text-sm text-gray-600">İşlemsel e-postalar için SendGrid entegrasyonu</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Bağlı</Badge>
                        <Button variant="outline" size="sm">Yapılandır</Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6" />
                        <div>
                          <h4 className="font-medium">Analitik</h4>
                          <p className="text-sm text-gray-600">Platform içgörüleri için Google Analytics</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Bağlı Degil</Badge>
                        <Button variant="outline" size="sm">Bağlan</Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6" />
                        <div>
                          <h4 className="font-medium">Guvenlik</h4>
                          <p className="text-sm text-gray-600">Gelişmiş kimlik doğrulama için Auth0</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Bağlı Degil</Badge>
                        <Button variant="outline" size="sm">Bağlan</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;





