<div className="flex flex-col gap-4 p-4 border rounded-lg">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-sm">{accounting software} Description</span>
      <input
        type="text"
        value={lineItem.description || ''}
        onChange={(e) => onChange('description', e.target.value)}
        className="border rounded p-2"
      />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm">Amount</span>
      <input
        type="number"
        value={lineItem.amount || ''}
        onChange={(e) => onChange('amount', e.target.value)}
        className="border rounded p-2 w-24"
      />
    </div>
  </div>
</div>